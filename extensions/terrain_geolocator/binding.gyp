{
  "targets": [
    {
      "target_name": "Geolocator_module",
      "sources": [ "Geolocator_module.cpp" ],
      "include_dirs": [ "vmr/geolocate", "vmr/geolocate" ],
      "cflags!": [ "-fno-exceptions" ],
      "cflags_cc!": [ "-fno-exceptions" ],
      "link_settings": { "libraries": [ "/usr/local/lib64/libvmr_geolocate.so" ]},
    }
  ]
}
