if(NOT TARGET jsc-android::jsc)
add_library(jsc-android::jsc SHARED IMPORTED)
set_target_properties(jsc-android::jsc PROPERTIES
    IMPORTED_LOCATION "C:/Users/ayush/.gradle/caches/8.10.2/transforms/a67fb6e43b2e3f97f62a5ebca57aadc6/transformed/jsc-android-2026004.0.1/prefab/modules/jsc/libs/android.x86_64/libjsc.so"
    INTERFACE_INCLUDE_DIRECTORIES "C:/Users/ayush/.gradle/caches/8.10.2/transforms/a67fb6e43b2e3f97f62a5ebca57aadc6/transformed/jsc-android-2026004.0.1/prefab/modules/jsc/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

