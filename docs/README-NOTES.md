# Class notes drop folder

Paste each class's notes into its folder:

```
docs/JSS1/
docs/JSS2/
docs/JSS3/
docs/SSS1/
docs/SSS2/
docs/SSS3/
```

## Supported formats

- Markdown (`.md`, `.markdown`)
- Plain text (`.txt`)
- Microsoft Word (`.docx`)

Old binary `.doc` files are not supported — save them as `.docx` or `.md` first.

## How subjects are detected

The file name (or a subject sub-folder) decides the subject:

- `Mathematics.md` → Mathematics
- `JSS1 Mathematics Notes.docx` → Mathematics
- `English Language.docx` → English Studies
- `Basic Science.docx` → Intermediate Science
- `SSS2-Biology.md` → Biology

You can also group files in subject sub-folders:

```
docs/SSS2/Biology/Cell Biology.docx
docs/SSS2/Chemistry/Organic Chemistry.md
```

## How topics are detected

Inside a file, topics can be split in any of these ways:

1. `# TOPIC 1: Whole Numbers` headings (the existing notes format).
2. `TOPIC 1:`, `UNIT 1:`, `CHAPTER 1:`, `WEEK 1:` markers.
3. Markdown headings such as `## Whole Numbers`.

If a file has no topic markers, the whole document becomes one topic named
after the subject — nothing is lost.

## Fallback

If a class/subject has no document yet, the school Curriculum section shows the
general curriculum notes for that class. Once you add a class document for that
subject, it replaces the general notes for that class only.
