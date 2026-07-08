from pathlib import Path

SCRIPT_FOLDER = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_FOLDER.parent

SRC_FOLDER = PROJECT_ROOT / "src"
OUTPUT_FOLDER = SCRIPT_FOLDER / "pack"

EXCLUDED_FOLDERS = {
    "assets",
}

TEXT_EXTENSIONS = {
    ".vue",
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
    ".json",
    ".scss",
    ".sass",
    ".css",
    ".html",
    ".md",
    ".txt",
    ".yml",
    ".yaml",
    ".env",
}


def read_text_safely(file_path: Path) -> str:
    try:
        return file_path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        return file_path.read_text(encoding="latin-1")


def should_include_file(file_path: Path, source_folder: Path) -> bool:
    relative_parts = file_path.relative_to(source_folder).parts

    if any(part in EXCLUDED_FOLDERS for part in relative_parts):
        return False

    return file_path.suffix.lower() in TEXT_EXTENSIONS


def combine_all_vue_project_files(
    source_folder: Path,
    output_file: Path,
    project_root: Path,
):
    files = sorted(
        file_path
        for file_path in source_folder.rglob("*")
        if file_path.is_file() and should_include_file(file_path, source_folder)
    )

    if not files:
        print("No text/code files found.")
        return

    output_file.parent.mkdir(parents=True, exist_ok=True)

    with output_file.open("w", encoding="utf-8") as out:
        for file_path in files:
            relative_path = file_path.relative_to(project_root)

            out.write("\n\n")
            out.write("// ============================================================\n")
            out.write(f"// File: {relative_path}\n")
            out.write("// ============================================================\n\n")

            code = read_text_safely(file_path)
            out.write(code)
            out.write("\n")

    print(f"Combined Vue project files into: {output_file}")


if __name__ == "__main__":
    project_name = PROJECT_ROOT.name
    output_file = OUTPUT_FOLDER / f"{project_name}.txt"

    combine_all_vue_project_files(SRC_FOLDER, output_file, PROJECT_ROOT)