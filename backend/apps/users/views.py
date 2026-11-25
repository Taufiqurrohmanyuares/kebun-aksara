from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from apps.users.models import User, ChildProfile, Classroom
from apps.users.permissions import IsTeacherRole


def is_weak_pin(pin: str) -> bool:
    if not pin or len(pin) != 4 or not pin.isdigit():
        return True
    if len(set(pin)) == 1:
        return True
    digits = [int(d) for d in pin]
    is_asc = all(digits[i] + 1 == digits[i + 1] for i in range(3))
    is_desc = all(digits[i] - 1 == digits[i + 1] for i in range(3))
    return is_asc or is_desc


def get_tokens_for_user(user: User):
    refresh = RefreshToken.for_user(user)
    refresh["role"] = user.role
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }


def serialize_children(user: User):
    return [
        {
            "id": c.id,
            "name": c.name,
            "birth_year": c.birth_year,
            "stars_balance": c.stars_balance,
            "current_level": c.current_level,
            "classroom_name": c.classroom.name if c.classroom else None,
        }
        for c in user.children.all()
    ]


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email", "").strip().lower()
        password = request.data.get("password", "")
        full_name = request.data.get("full_name", "").strip()
        role = request.data.get("role", User.Role.PARENT)
        parent_pin = str(request.data.get("parent_pin", "")).strip()
        child_name = request.data.get("child_name", "").strip()
        school_name = request.data.get("school_name", "").strip()

        if not email or not password or not full_name:
            return Response(
                {"status": "error", "message": "Nama lengkap, email, dan kata sandi wajib diisi."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if len(password) < 8:
            return Response(
                {"status": "error", "message": "Kata sandi minimal 8 karakter."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if role not in [User.Role.PARENT, User.Role.TEACHER]:
            role = User.Role.PARENT

        if role == User.Role.PARENT and is_weak_pin(parent_pin):
            return Response(
                {
                    "status": "error",
                    "message": "Gunakan 4 angka acak untuk PIN (hindari angka kembar atau berurutan).",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if User.objects.filter(email=email).exists():
            return Response(
                {"status": "error", "message": "Email sudah terdaftar."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = User.objects.create_user(email=email, password=password, full_name=full_name, role=role)
        if role == User.Role.PARENT and parent_pin:
            user.set_parent_pin(parent_pin)
        user.save()

        if role == User.Role.PARENT and child_name:
            ChildProfile.objects.create(parent=user, name=child_name)
        elif role == User.Role.TEACHER:
            class_title = f"Kelas {school_name}" if school_name else f"Kelas {full_name}"
            Classroom.objects.create(teacher=user, name=class_title)

        tokens = get_tokens_for_user(user)
        return Response(
            {
                "status": "success",
                "data": {
                    **tokens,
                    "user": {"id": user.id, "email": user.email, "full_name": user.full_name, "role": user.role},
                    "children": serialize_children(user),
                },
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email", "").strip().lower()
        password = request.data.get("password", "")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"status": "error", "message": "Email atau kata sandi belum cocok. Coba lagi."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        if not user.check_password(password):
            return Response(
                {"status": "error", "message": "Email atau kata sandi belum cocok. Coba lagi."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        tokens = get_tokens_for_user(user)
        return Response(
            {
                "status": "success",
                "data": {
                    **tokens,
                    "user": {"id": user.id, "email": user.email, "full_name": user.full_name, "role": user.role},
                    "children": serialize_children(user),
                },
            }
        )


class VerifyParentPinView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        pin = str(request.data.get("pin", ""))
        if request.user.check_parent_pin(pin):
            return Response({"status": "success", "message": "PIN terverifikasi."})
        return Response(
            {"status": "error", "message": "PIN orang tua tidak sesuai."},
            status=status.HTTP_403_FORBIDDEN,
        )


class ChildProfileListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"status": "success", "data": serialize_children(request.user)})

    def post(self, request):
        name = request.data.get("name", "").strip()
        birth_year = int(request.data.get("birth_year", 2020))
        invite_code = request.data.get("invite_code", "").strip().upper()

        if not name:
            return Response(
                {"status": "error", "message": "Nama anak wajib diisi."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        classroom = None
        if invite_code:
            classroom = Classroom.objects.filter(invite_code=invite_code).first()

        ChildProfile.objects.create(
            parent=request.user, name=name, birth_year=birth_year, classroom=classroom
        )
        return Response(
            {"status": "success", "data": serialize_children(request.user)},
            status=status.HTTP_201_CREATED,
        )


class JoinClassroomView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, child_id):
        invite_code = request.data.get("invite_code", "").strip().upper()
        child = ChildProfile.objects.filter(id=child_id, parent=request.user).first()
        if not child:
            return Response({"status": "error", "message": "Profil anak tidak ditemukan."}, status=404)

        classroom = Classroom.objects.filter(invite_code=invite_code).first()
        if not classroom:
            return Response({"status": "error", "message": "Kode kelas tidak ditemukan."}, status=404)

        child.classroom = classroom
        child.save(update_fields=["classroom"])
        return Response(
            {"status": "success", "data": {"classroom_name": classroom.name, "invite_code": classroom.invite_code}}
        )


class TeacherClassroomView(APIView):
    permission_classes = [IsTeacherRole]

    def get(self, request):
        classrooms = Classroom.objects.filter(teacher=request.user).prefetch_related("students")
        data = []
        for cls in classrooms:
            students_data = [
                {
                    "id": s.id,
                    "name": s.name,
                    "current_level": s.current_level,
                    "stars_balance": s.stars_balance,
                    "completed_nodes": s.progress_records.filter(is_completed=True).count(),
                }
                for s in cls.students.all()
            ]
            data.append(
                {
                    "id": cls.id,
                    "name": cls.name,
                    "invite_code": cls.invite_code,
                    "students": students_data,
                }
            )
        return Response({"status": "success", "data": data})

    def post(self, request):
        name = request.data.get("name", "").strip()
        if not name:
            return Response({"status": "error", "message": "Nama kelas wajib diisi."}, status=400)
        cls = Classroom.objects.create(teacher=request.user, name=name)
        return Response(
            {"status": "success", "data": {"id": cls.id, "name": cls.name, "invite_code": cls.invite_code}},
            status=201,
        )