---
sidebar_position: 2
---

# Instructions to Build the Oasis Project

## Prerequisites
- Ensure you have a C++ compiler installed. Oasis requires at least CMake 3.18 to build, so make sure your compiler supports at least this version.
- Git should be installed on your machine as some dependencies are fetched from their respective Git repositories.

## Steps to build Oasis
1. **Clone the Oasis project from its repository**
    - Use the command: `git clone https://github.com/open-algebra/Oasis`
    - Navigate to the cloned directory: `cd Oasis`

2. **Setup a build directory**
    - Inside the Oasis directory, create a new directory named "build": `mkdir build`

3. **Configure the project**
    - Run `cmake -B build .` This will configure the project and prepare to generate the build system, using the default generator and compiler on your environment. 
    - If you want to use a specific generator, specify it with -G. For example, to use the "Ninja" generator, run `cmake -G "Ninja" -B build .`

4. **Customize the Build options**
    - Oasis project provides several options that you can toggle ON/OFF according to your needs:

      - `OASIS_BUILD_EXTRAS`: Enables building extra modules for Oasis
      - `OASIS_BUILD_TESTS`: Enables building unit tests for Oasis
      - `OASIS_BUILD_WITH_COVERAGE`: Enables building Oasis with code coverage enabled. Note that only the Clang compiler is currently supported for code coverage.

      These options are turned OFF by default.
    - To turn these options ON, you can run CMake with -D. For example, to enable building of tests, run `cmake -DOASIS_BUILD_TESTS=ON -B build .`

5. **Build the Project**
    - Run `cmake --build .` This will start the actual build process. Ensure that you have the necessary permissions to read and write in your build directory.

6. **Running Tests** (If `OASIS_BUILD_TESTS` was set to ON)
    - After successfully building the project, you can run the unit tests using `ctest` command.

Feel free to repeat steps 3-5 to re-configure and re-build the project using different options. Make sure to clear your build directory before doing so.