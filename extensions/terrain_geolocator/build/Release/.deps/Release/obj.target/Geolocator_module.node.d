cmd_Release/obj.target/Geolocator_module.node := flock ./Release/linker.lock g++ -shared -pthread -rdynamic -m64  -Wl,-soname=Geolocator_module.node -o Release/obj.target/Geolocator_module.node -Wl,--start-group Release/obj.target/Geolocator_module/Geolocator_module.o -Wl,--end-group /usr/local/lib64/libvmr_geolocate.so