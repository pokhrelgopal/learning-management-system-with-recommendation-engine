import os
import time
from PIL import Image, ImageDraw, ImageFont
from django.conf import settings


def certificate(student_name, instructor_name, course_name):
    base_dir = os.path.dirname(os.path.abspath(__file__))
    certificate_path = os.path.join(base_dir, "certificate.png")
    font1_path = os.path.join(base_dir, "fonts", "norwester.otf")
    font2_path = os.path.join(base_dir, "fonts", "garamond.ttf")
    font3_path = os.path.join(base_dir, "fonts", "Signature.otf")
    font4_path = os.path.join(base_dir, "fonts", "garamond.ttf")

    img = Image.open(certificate_path)
    draw = ImageDraw.Draw(img)

    font1 = ImageFont.truetype(font1_path, 110)
    font2 = ImageFont.truetype(font2_path, 40)
    font3 = ImageFont.truetype(font3_path, 60)
    font4 = ImageFont.truetype(font4_path, 41)

    student_name_position = (140, 580)
    course_name_position = (140, 845)
    signature_position = (140, 1120)
    instructor_name_position = (140, 1210)

    draw.text(student_name_position, student_name, fill="black", font=font1)
    draw.text(course_name_position, course_name.upper(), fill="black", font=font4)
    draw.text(signature_position, instructor_name, fill="black", font=font3)
    draw.text(
        instructor_name_position, instructor_name.upper(), fill="black", font=font2
    )

    output_dir = os.path.join(settings.MEDIA_ROOT, "certificates")
    os.makedirs(output_dir, exist_ok=True)
    filename = os.path.join(output_dir, f"{int(time.time())}.png")
    img.save(filename)

    relative_path = os.path.relpath(filename, settings.MEDIA_ROOT)
    return relative_path
