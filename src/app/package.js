/*global profile:true*/
profile = {
    resourceTags: {
            // Files that contain test code and should be excluded when the `copyTests` build flag exists and is `false`.
            // It is strongly recommended that the `mini` build flag be used instead of `copyTests`. Therefore, no files
            // are marked with the `test` tag here.
            test: function () {
                return false;
            },

            // Files that should be copied as-is without being modified by the build system.
            // All files in the `app/resources` directory that are not CSS files are marked as copy-only, since these files
            // are typically binaries (images, etc.) and may be corrupted by the build system if it attempts to process
            // them and naively assumes they are scripts.
            copyOnly: function (filename, mid) {
                return (/^app\/resources\//.test(mid) && !/\.css$/.test(filename));
            },

            // Files that are AMD modules.
            // All JavaScript in this package should be AMD modules if you are starting a new project. If you are copying
            // any legacy scripts from an existing project, those legacy scripts should not be given the `amd` tag.
            amd: function (filename, mid) {
                return !this.copyOnly(filename, mid) && /\.js$/.test(filename);
            },

            // Files that should not be copied when the `mini` build flag is set to true.
            // In this case, we are excluding this package configuration file which is not necessary in a built copy of
            // the application.
            miniExclude: function (filename, mid) {
                return mid in {
                    'app/package': 1
                };
            }
        }
};