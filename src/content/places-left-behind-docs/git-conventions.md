---
title: "Git Conventions and Workflow"
version: "0.1.0"
docStatus: "Reference"
summary: "Commit message structure, commit types, and the Git workflow used for the game."
sourceId: ""
sourcePath: "Documentation/Git-Conventions.md"
category: "engineering"
order: 30
sourceCommit: "9f8e7151d9a86f58305f0889dd4f5ef7b5e51fb2"
legal: false
---
**Project:** Places Left Behind
**Version:** 0.1.0
**Commit Convention:** Conventional Commits
**Primary Branch:** `main`
**Remote Repository:** `origin`
**Git Hosting:** GitHub

---

## 1. Introduction

This document establishes the official Git conventions and version-control workflow for Places Left Behind.

Git is used to track changes throughout development, maintain a history of the project's source code, and synchronize the local project with its remote GitHub repository.

The objective is to maintain a clean, understandable, and reliable development history.

All commits should communicate what changed and, when appropriate, why the change was necessary.

The project follows the **Conventional Commits** specification, with a few practical conventions established specifically for Places Left Behind.

### 1.1 Core Principles

The following principles should be followed throughout development:

- Commit meaningful changes regularly.
- Use descriptive and consistent commit messages.
- Keep commits focused on individual features, fixes, or improvements.
- Avoid committing temporary or generated files.
- Push completed work to GitHub regularly.
- Never commit credentials, passwords, or private access tokens.
- Keep the primary `main` branch in a stable condition whenever practical.

---

## 2. Commit Message Structure

Every commit should follow this format:

```text
type: description
```

The general Git command is:

```powershell
git commit -m "type: description"
```

### Example

```powershell
git commit -m "feat: add player movement"
```

The commit type identifies the category of change.

The description briefly explains what the commit accomplishes.

### 2.1 Formatting Requirements

Follow these rules when writing commit messages:

1. Use lowercase commit types.
2. Separate the type and description with a colon and a space.
3. Keep descriptions concise but informative.
4. Prefer imperative wording, describing what the commit does.
5. Do not add a period at the end.
6. Describe the actual changes included in the commit.
7. Avoid generic descriptions that provide little information.
8. Keep unrelated changes in separate commits whenever practical.

#### Good Examples

```text
feat: add player movement
fix: correct camera rotation
refactor: reorganize rendering architecture
docs: update development documentation
perf: optimize texture loading
```

#### Poor Examples

```text
updated stuff
fixed things
more changes
working on game
final update
```

A commit message should remain understandable months or even years after it was created.

---

## 3. Commit Types

The following commit types are approved for Places Left Behind.

### 3.1 feat

**Category:** New Features

Use `feat` when introducing new functionality, systems, mechanics, or capabilities.

Examples:

```text
feat: add player movement
feat: implement camera controls
feat: introduce interaction system
feat: add document collection
feat: implement inventory management
feat: add investigation photographs
feat: introduce location selection
feat: implement save system
```

Typical use cases:

- Adding a new gameplay system.
- Introducing a new engine subsystem.
- Implementing new player functionality.
- Adding new user interface features.
- Introducing new interactions or mechanics.

### 3.2 fix

**Category:** Bug Fixes

Use `fix` when correcting unintended behavior, errors, crashes, or broken functionality.

Examples:

```text
fix: correct player collision detection
fix: resolve Vulkan initialization failure
fix: prevent duplicate interaction prompts
fix: correct texture loading
fix: resolve save data corruption
fix: prevent camera clipping
```

Typical use cases:

- Fixing crashes.
- Correcting incorrect calculations.
- Resolving broken interactions.
- Fixing rendering problems.
- Correcting unexpected gameplay behavior.

### 3.3 refactor

**Category:** Code Restructuring

Use `refactor` when improving existing code organization, architecture, readability, or maintainability without intentionally changing its external behavior.

Examples:

```text
refactor: reorganize rendering architecture
refactor: separate window management from application logic
refactor: simplify player input handling
refactor: improve asset manager structure
refactor: separate engine and gameplay responsibilities
```

Typical use cases:

- Improving class organization.
- Removing unnecessary duplication.
- Separating responsibilities.
- Improving internal architecture.
- Simplifying complicated implementations.

A refactor should not introduce unrelated functionality.

### 3.4 docs

**Category:** Documentation

Use `docs` for documentation changes.

Examples:

```text
docs: add Git conventions
docs: update architecture documentation
docs: document asset import workflow
docs: expand Vulkan development guide
docs: update project setup instructions
```

Typical use cases:

- Creating Markdown documentation.
- Updating development instructions.
- Documenting systems and architecture.
- Improving technical explanations.
- Updating project guides.

### 3.5 style

**Category:** Code Formatting

Use `style` for changes that affect formatting or presentation without changing functionality.

Examples:

```text
style: standardize C# formatting
style: organize using directives
style: clean up shader formatting
style: improve code consistency
```

Typical use cases:

- Formatting code.
- Adjusting whitespace.
- Organizing imports.
- Applying consistent formatting conventions.

### 3.6 perf

**Category:** Performance Improvements

Use `perf` when making changes specifically intended to improve performance or resource efficiency.

Examples:

```text
perf: optimize texture loading
perf: reduce rendering overhead
perf: improve asset caching
perf: reduce memory allocations
perf: optimize scene loading
```

Typical use cases:

- Reducing memory usage.
- Improving frame times.
- Optimizing asset loading.
- Reducing unnecessary allocations.
- Improving rendering efficiency.

Performance changes should ideally be supported by measurements or profiling.

### 3.7 test

**Category:** Testing

Use `test` when adding, modifying, or improving automated tests.

Examples:

```text
test: add engine initialization tests
test: cover player movement calculations
test: verify interaction system behavior
test: add asset loading tests
```

Typical use cases:

- Adding unit tests.
- Expanding test coverage.
- Correcting test cases.
- Introducing integration tests.
- Improving automated validation.

### 3.8 build

**Category:** Build Configuration

Use `build` for changes involving project configuration, dependencies, compilation, or packaging.

Examples:

```text
build: update Silk.NET packages
build: configure Windows publishing
build: add Vulkan SDK validation
build: update project configuration
build: improve release packaging
```

Typical use cases:

- Updating NuGet dependencies.
- Modifying project files.
- Changing compilation settings.
- Updating publishing configuration.
- Adjusting build scripts.

### 3.9 chore

**Category:** General Maintenance

Use `chore` for routine maintenance that does not fit another category.

Examples:

```text
chore: organize project directories
chore: update gitignore rules
chore: remove unused development files
chore: clean temporary build artifacts
```

Typical use cases:

- Organizing files.
- Cleaning unused resources.
- Updating repository housekeeping.
- Maintaining development tooling.
- Performing miscellaneous maintenance.

### 3.10 ci

**Category:** Continuous Integration

Use `ci` when modifying automated development, build, testing, or deployment workflows.

Examples:

```text
ci: add automated build validation
ci: configure Windows build workflow
ci: add automated test execution
ci: improve release verification
```

Typical use cases:

- GitHub Actions workflows.
- Automated builds.
- Automated tests.
- Continuous integration configuration.
- Deployment automation.

---

## 4. Breaking Changes

A breaking change modifies an interface, system, or behavior in a way that requires existing code or configurations to be updated.

Breaking changes should be explicitly identified.

An exclamation mark can be placed after the commit type:

```text
feat!: redesign the asset loading interface
```

Alternatively, include a `BREAKING CHANGE` footer:

```text
refactor: replace the old input architecture

BREAKING CHANGE: Existing input bindings must be migrated.
```

Use breaking change notation only when compatibility is genuinely affected.

Examples include:

- Replacing an existing public interface.
- Changing save file formats incompatibly.
- Removing previously supported functionality.
- Changing configuration formats.
- Requiring existing gameplay systems to be rewritten.

---

## 5. Writing Effective Commit Messages

Commit descriptions should explain the result of a change rather than simply describing the activity performed.

### Example: Vulkan Development

Good:

```text
feat: initialize Vulkan instance
```

Avoid:

```text
feat: work on Vulkan
```

### Example: Player Development

Good:

```text
fix: prevent player movement through walls
```

Avoid:

```text
fix: movement issue
```

### Example: Architecture

Good:

```text
refactor: separate rendering and window management
```

Avoid:

```text
refactor: clean up code
```

### Example: Documentation

Good:

```text
docs: document texture organization conventions
```

Avoid:

```text
docs: update files
```

The description should be specific enough that another developer can understand the change without opening the commit.

---

## 6. Custom Git Commands

Places Left Behind uses a custom Git alias to simplify the process of publishing commits.

Instead of repeatedly typing the full push command, use:

```powershell
git publish
```

### 6.1 Installing the Custom Command

Run this command once:

```powershell
git config --global alias.publish "push -u origin HEAD"
```

This creates a global Git alias named `publish`.

The alias runs the equivalent of:

```powershell
git push -u origin HEAD
```

This pushes the current branch to the corresponding remote branch and establishes upstream tracking.

The alias is global, meaning it can also be used in other Git repositories on this computer.

### 6.2 Using the Custom Command

After installation, publish your changes with:

```powershell
git publish
```

This command should be used after creating a commit.

#### Example: Publishing a Commit

```powershell
git add .
git commit -m "feat: add player movement"
git publish
```

The command sequence:

1. Stages the project changes.
2. Creates a commit with the supplied message.
3. Pushes the commit to GitHub.

The `-u` option establishes upstream tracking when necessary. Future pushes continue to use the same remote branch.

### 6.3 Important Notes

- The custom alias only simplifies pushing. It does not create commits.
- Changes must be committed before they can be pushed.
- The remote repository must be configured.
- GitHub authentication must be available.
- A successful push does not mean every uncommitted change was uploaded.

---

## 7. Standard Development Workflow

The following workflow should be used during normal development.

### Step 1: Check Repository Status

```powershell
git status
```

Review the files that have changed.

### Step 2: Review Changes

```powershell
git diff
```

This displays changes that have not yet been staged.

To review staged changes:

```powershell
git diff --staged
```

Reviewing changes before committing helps catch accidental modifications.

### Step 3: Stage Changes

To stage all project changes:

```powershell
git add .
```

To stage an individual file:

```powershell
git add Source/Engine/Core/Application.cs
```

For larger changes, staging specific files can help keep commits focused.

### Step 4: Create a Commit

```powershell
git commit -m "type: description"
```

Use the appropriate commit type.

### Step 5: Publish Changes

```powershell
git publish
```

This uploads the commit to GitHub.

### 7.1 Complete Example

```powershell
git status
git add .
git commit -m "feat: initialize Vulkan instance"
git publish
```

This is the standard development workflow for Places Left Behind.

---

## 8. Git Commands Reference

| Command | Purpose |
| --- | --- |
| `git status` | Displays repository status. |
| `git add .` | Stages all changes. |
| `git add filename` | Stages a specific file. |
| `git commit -m "message"` | Creates a commit. |
| `git publish` | Pushes commits to GitHub. |
| `git diff` | Displays unstaged changes. |
| `git diff --staged` | Displays staged changes. |
| `git log --oneline` | Displays compact commit history. |
| `git log --graph --oneline --all` | Displays branch and commit history. |
| `git pull` | Retrieves and integrates remote changes. |
| `git fetch` | Retrieves remote updates without integrating them. |
| `git branch` | Lists local branches. |
| `git branch -a` | Lists local and remote branches. |
| `git switch branch-name` | Switches branches. |
| `git switch -c branch-name` | Creates and switches to a new branch. |
| `git remote -v` | Displays configured remotes. |
| `git restore filename` | Discards unstaged changes to a file. |
| `git restore --staged filename` | Removes a file from the staging area. |

**Warning:** `git restore` can permanently discard local work. Review the file and its changes before using it.

---

## 9. Branching Strategy

The primary development branch is:

```text
main
```

The `main` branch represents the primary project history.

For larger features or experimental changes, separate branches may be created.

Examples:

```text
feature/player-movement
feature/vulkan-renderer
feature/investigation-system
fix/camera-clipping
refactor/asset-management
```

### 9.1 Creating a Feature Branch

```powershell
git switch -c feature/player-movement
```

This creates a new branch and switches to it.

Work can then be committed independently of `main`.

### 9.2 Returning to Main

```powershell
git switch main
```

### 9.3 Branching Recommendations

Use separate branches when:

- Implementing a large feature.
- Experimenting with architectural changes.
- Testing potentially unstable functionality.
- Working on changes that should not immediately enter the primary branch.

Small, straightforward changes can be committed directly to `main`.

Avoid creating unnecessary branches for every minor modification.

---

## 10. Commit Frequency and Organization

Commits should be created regularly, but not after every individual line of code.

Good opportunities to create a commit include:

- Completing a feature.
- Fixing a bug.
- Finishing an engine subsystem.
- Completing a meaningful refactor.
- Updating documentation.
- Changing project configuration.
- Completing a substantial asset pipeline improvement.

Whenever practical, keep each commit focused on one logical change.

For example, avoid combining all of the following into one commit:

- Vulkan initialization.
- Player movement.
- Documentation updates.
- Asset organization.

These changes should normally be separated.

This makes reviewing, reverting, and understanding the project's history considerably easier.

---

## 11. Repository File Management

The repository should contain the source files and resources necessary to develop and maintain Places Left Behind.

Do not commit unnecessary generated or temporary files.

Examples include:

- Compiled binaries.
- Temporary build output.
- IDE caches.
- Temporary exports.
- Local debugging files.
- Unnecessary generated files.
- Private credentials.

The `.gitignore` file should exclude generated files and other items that do not belong in version control.

### 11.1 Game Assets

Game assets are part of the project and should generally be tracked when they are ready to be included.

Examples:

- Blender source files.
- Exported models.
- Textures.
- Materials.
- Audio files.
- Fonts and their required licenses.
- Scene data.
- Game configuration files.

Large binary assets may eventually require a more deliberate storage strategy.

Git LFS can be considered if the repository grows substantially, but it is not necessary to introduce it prematurely.

### 11.2 Security

Never commit:

- Passwords.
- API keys.
- Authentication tokens.
- Private signing keys.
- Personal credentials.
- Sensitive configuration files.

If a secret is accidentally committed, removing it in a later commit does not erase it from the repository's history. Treat the credential as exposed and rotate it.

---

## 12. Troubleshooting

### 12.1 Nothing to Commit

Message:

```text
nothing to commit, working tree clean
```

Meaning:

Git has not detected any new changes to commit.

This is not an error.

Check the repository with:

```powershell
git status
```

### 12.2 No Upstream Branch

Message:

```text
fatal: The current branch main has no upstream branch.
```

Meaning:

The local branch has not yet been linked to its remote counterpart.

Solution:

```powershell
git publish
```

The custom alias includes the upstream configuration option.

Alternatively, use the full command:

```powershell
git push --set-upstream origin main
```

### 12.3 Authentication Problems

If GitHub requests authentication:

1. Follow the Git Credential Manager or browser authentication prompt.
2. Sign in to the appropriate GitHub account.
3. Complete any requested authorization.
4. Retry the push if necessary.

Never share passwords, access tokens, or authentication codes.

### 12.4 Remote Repository Problems

Check the configured remote:

```powershell
git remote -v
```

The expected remote is:

```text
origin
https://github.com/Pandagamerteen08/Places-Left-Behind.git
```

If the remote is missing:

```powershell
git remote add origin https://github.com/Pandagamerteen08/Places-Left-Behind.git
```

If the remote exists but points to the wrong location:

```powershell
git remote set-url origin https://github.com/Pandagamerteen08/Places-Left-Behind.git
```

### 12.5 Push Rejected

If GitHub rejects a push because the remote contains changes that are not present locally, do not force-push immediately.

Inspect the repository state and remote history first.

A normal pull or a deliberate history reconciliation may be necessary.

Avoid using:

```powershell
git push --force
```

unless there is a specific, understood reason to rewrite remote history.

---

## 13. Recommended Practices

The following practices should be maintained throughout development.

1. Use Conventional Commits consistently.
2. Write meaningful commit descriptions.
3. Commit completed logical changes.
4. Review staged changes before committing.
5. Publish completed work regularly.
6. Keep `main` reasonably stable.
7. Use feature branches for substantial experimental work.
8. Keep generated files out of version control.
9. Never commit credentials or secrets.
10. Update documentation when architecture or workflows change.
11. Avoid unnecessary dependencies and repository clutter.
12. Do not rewrite published history without a good reason.

---

## 14. Official References

The following resources provide additional information about Git and Conventional Commits.

- Git documentation: <https://git-scm.com/doc>
- Git reference: <https://git-scm.com/docs>
- Conventional Commits: <https://www.conventionalcommits.org/>
- GitHub documentation: <https://docs.github.com/>
- GitHub repository: <https://github.com/Pandagamerteen08/Places-Left-Behind>

---

## 15. Project Standard

The following conventions are the established defaults for Places Left Behind.

**Commit format:**

```text
type: description
```

**Approved commit types:**

```text
feat
fix
refactor
docs
style
perf
test
build
chore
ci
```

**Primary branch:**

```text
main
```

**Remote:**

```text
origin
```

**Custom push command:**

```powershell
git publish
```

**Standard development workflow:**

```powershell
git status
git add .
git commit -m "type: description"
git publish
```

The objective is to maintain a reliable, organized, and understandable development history as Places Left Behind evolves.

**Consistency, clarity, and deliberate version control are the priorities.**
