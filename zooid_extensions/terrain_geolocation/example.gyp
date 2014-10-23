//This example assumes you have an external library 'thelibrary', located in 
//./external/thelibrary
//With the two flavors, debug and release in lib/debug and lib/release
{
    "targets": [
        {
            "target_name": "addon",
            "sources": [
                "src/addon.cpp",
                "src/expose_the_library.cpp"
            ],
            "include_dirs": [
                "external/thelibrary/include"
            ],
            "cflags!": [
                "-fno-exceptions"
            ],
            "cflags_cc!": [
                "-fno-exceptions"
            ],
            "conditions": [
                [
                    "OS=='mac'",
                    {
                        "defines": [
                            "__MACOSX_CORE__"
                        ],
                        "architecture": "i386",
                        "xcode_settings": {
                            "GCC_ENABLE_CPP_EXCEPTIONS": "YES"
                        },
                        "link_settings": {
                            "libraries": [
                                "-lthelibrary",
                                "-framework",   
                                "IOBluetooth" //this is how you use a framework on OSX
                            ],
                            "configurations": {
                                "Debug": {
                                    "xcode_settings": {
                                        "OTHER_LDFLAGS": [
                                            "-Lexternal/thelibrary/lib/debug"
                                        ]
                                    }
                                },
                                "Release": {
                                    "xcode_settings": {
                                        "OTHER_LDFLAGS": [
                                            "-Lexternal/thelibrary/lib/release"
                                        ]
                                    }
                                }
                            }
                        }
                    }
                ],
                [
                    "OS=='win'",
                    {
                        "link_settings": {
                            "libraries": [
                                "-lthelibrary.lib",
                            ]
                        },
                        "configurations": {
                            "Debug": {
                                "msvs_settings": {
                                    "VCCLCompilerTool": {
                                        "ExceptionHandling": "0",
                                        "AdditionalOptions": [
                                            "/MP /EHsc"
                                        ]
                                    },
                                    "VCLibrarianTool": {
                                        "AdditionalOptions": [
                                            "/LTCG"
                                        ]
                                    },
                                    "VCLinkerTool": {
                                        "LinkTimeCodeGeneration": 1,
                                        "LinkIncremental": 1,
                                        "AdditionalLibraryDirectories": [
                                            "../external/thelibrary/lib/debug"
                                        ]
                                    }
                                }
                            },
                            "Release": {
                                "msvs_settings": {
                                    "VCCLCompilerTool": {
                                        "RuntimeLibrary": 0,
                                        "Optimization": 3,
                                        "FavorSizeOrSpeed": 1,
                                        "InlineFunctionExpansion": 2,
                                        "WholeProgramOptimization": "true",
                                        "OmitFramePointers": "true",
                                        "EnableFunctionLevelLinking": "true",
                                        "EnableIntrinsicFunctions": "true",
                                        "RuntimeTypeInfo": "false",
                                        "ExceptionHandling": "0",
                                        "AdditionalOptions": [
                                            "/MP /EHsc"
                                        ]
                                    },
                                    "VCLibrarianTool": {
                                        "AdditionalOptions": [
                                            "/LTCG"
                                        ]
                                    },
                                    "VCLinkerTool": {
                                        "LinkTimeCodeGeneration": 1,
                                        "OptimizeReferences": 2,
                                        "EnableCOMDATFolding": 2,
                                        "LinkIncremental": 1,
                                        "AdditionalLibraryDirectories": [
                                            "../external/thelibrary/lib/release"
                                        ]
                                    }
                                }
                            }
                        }
                    }
                ]
            ]
        }
    ]
}