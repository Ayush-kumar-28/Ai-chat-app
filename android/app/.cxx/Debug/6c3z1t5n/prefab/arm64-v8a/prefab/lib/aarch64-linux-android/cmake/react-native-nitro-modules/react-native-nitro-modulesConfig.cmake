if(NOT TARGET react-native-nitro-modules::NitroModules)
add_library(react-native-nitro-modules::NitroModules SHARED IMPORTED)
set_target_properties(react-native-nitro-modules::NitroModules PROPERTIES
    IMPORTED_LOCATION "C:/Users/ayush/OneDrive/Desktop/new/AIChatApp/node_modules/react-native-nitro-modules/android/build/intermediates/cxx/Debug/631l2e3j/obj/arm64-v8a/libNitroModules.so"
    INTERFACE_INCLUDE_DIRECTORIES "C:/Users/ayush/OneDrive/Desktop/new/AIChatApp/node_modules/react-native-nitro-modules/android/build/headers/nitromodules"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

