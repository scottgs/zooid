#ifndef GEOLOCATOR_MODULE_HPP
#define GEOLOCATOR_MODULE_HPP

#include <node.h>
// #include <tr1/memory>
#include <vmr/geolocate/Geolocator.hpp>


class Geolocator_module : public node::ObjectWrap {
public:
    static v8::Persistent<v8::FunctionTemplate> constructor;
    static void Init(v8::Handle<v8::Object> target);

protected:
    Geolocator_module();

    static v8::Handle<v8::Value> New(const v8::Arguments& args);
    static v8::Handle<v8::Value> initialize(const v8::Arguments& args);
    static v8::Handle<v8::Value> Search(const v8::Arguments& args);
    static v8::Handle<v8::Value> getConfig(const v8::Arguments& args);
    // std::tr1::shared_ptr< geolocate::Geolocator > _geo;
    geolocate::Geolocator* _geo;


private:
    std::string _configFile;
    std::string _test;
};

#endif