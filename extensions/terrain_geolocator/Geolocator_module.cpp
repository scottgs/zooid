#include <node.h>
#include <string>
#include <vector>
#include <fstream>
#include <sstream>
#include <iostream>
#include <iterator>
#include <tr1/memory>

#include "vmr/geolocate/Geolocator.hpp"
#include "Geolocator_module.hpp"

using namespace v8;

// -------------------------------------------------------------------------
// Makes persisitent constructor
// -------------------------------------------------------------------------

Persistent<FunctionTemplate> Geolocator_module::constructor;
void Geolocator_module::Init(Handle<Object> target) {
    HandleScope scope;

    // Sets up V* Environmnt.
    Local<FunctionTemplate> tpl = FunctionTemplate::New(New);
    Local<String> name = String::NewSymbol("Geolocator_module");
    constructor = Persistent<FunctionTemplate>::New(tpl);

    // Uses first internal field to store wrapped pointer.
    constructor->InstanceTemplate()->SetInternalFieldCount(4);
    constructor->SetClassName(name);

    // Adds all prototype methods, getters and setters
    NODE_SET_PROTOTYPE_METHOD(constructor, "initialize", initialize);
    NODE_SET_PROTOTYPE_METHOD(constructor, "search", Search);
    NODE_SET_PROTOTYPE_METHOD(constructor, "getConfig", getConfig);

    // Sets target to constructor
    target->Set(name, constructor->GetFunction());
}

// -----------------------------------------------------------------------------
// Construct
// -----------------------------------------------------------------------------

Geolocator_module::Geolocator_module()
    : ObjectWrap() {}

Handle<Value> Geolocator_module::New(const Arguments& args) {
    HandleScope scope;

    // Creates a new instance, wraps it, returns it.
    Geolocator_module* obj = new Geolocator_module();
    obj->Wrap(args.This());
    return args.This();
}

// -----------------------------------------------------------------------------
// Gelocates a signal by querying the database for clustered KNN
// -----------------------------------------------------------------------------
// * @param int clusterSize
// * @param int clusterDistance
// * @param array<string> dataset
// * @return err, clusterResults
// -----------------------------------------------------------------------------

Handle<Value> Geolocator_module::Search( const Arguments& args ) {
    HandleScope scope;

    // Cast input values to specific types.
    // http://izs.me/v8-docs/classv8_1_1Value.html
    
    Handle<Array> inputArray = Handle<Array>::Cast(args[0]);
    std::vector<std::string> searchVector;

    for (uint32_t i = 0; i < inputArray->Length(); i++) {
        String::Utf8Value searchString(inputArray->Get(Integer::New(i))->ToString());
        std::string sv = std::string(*searchString);
        std::cout << sv;
        searchVector.push_back(sv);
    }

    String::Utf8Value dataSet(args[1]->ToString());
    std::string dataset = std::string(*dataSet); 

    int resultCount     = args[2]->Uint32Value();
    int scoreBoundary   = args[3]->Uint32Value();

    // preps callback function
    if (!args[4]->IsFunction()) {
        return ThrowException(Exception::TypeError(
            String::New("Second argument must be a callback function")));
    }

    Local<Function> callback = Local<Function>::Cast(args[4]);

    // dataset specification
    // std::vector<std::string> searchVector;
    // searchVector.push_back(sv);

    // unwrap Geolocator object
    Geolocator_module* obj = ObjectWrap::Unwrap<Geolocator_module>(args.This());

    std::tr1::shared_ptr<std::vector<ClusterResult> > results 
        = obj->_geo->search( searchVector, dataset, resultCount, scoreBoundary );

    std::cout << results->size() << std::endl;

    Handle<v8::Array> output = Array::New(results->size());

    // Wrap all the centroid results.
    for(uint32_t i = 0; i < results->size() ; i++){

        v8::Local<v8::Object> llos_centroid = v8::Object::New();

        llos_centroid->Set( String::New("lon"), 
            Number::New( results->at(i).lon_mode ));
        llos_centroid->Set( String::New("lat"), 
            Number::New( results->at(i).lat_mode ));
        llos_centroid->Set( String::New("score"), 
            Number::New( results->at(i).avg_score ));
        llos_centroid->Set( String::New("orientation"), 
            Number::New( results->at(i).avg_orientation ));

        // Wrap the points for each centroid
        v8::Local<v8::Array> points = v8::Array::New();
        for (uint32_t k = 0; k < results->at(i).points.size() ; k++){

            v8::Local<v8::Object> point = v8::Object::New();

            point->Set( String::New("lon"),
                Number::New( results->at(i).points.at(k).lat ));
            point->Set( String::New("lat"),
                Number::New( results->at(i).points.at(k).lon ));
            point->Set( String::New("score"),
                Number::New( results->at(i).points.at(k).score ));
            point->Set( String::New("orientation"),
                Number::New( results->at(i).points.at(k).orientation ));

            points->Set( k, point );
        }

        llos_centroid->Set( String::New("points"), points );
        output->Set( i, llos_centroid );
    }

    const unsigned argc = 3;
    Local<Value> argv[argc] = {
        Local<Value>::New(String::New("no")),
        Local<Value>::New(output),
        Local<Value>::New(Integer::New(0))
    };

    // Note: When calling this in an asynchronous function that just returned
    // from the threadpool, you have to wrap this in a v8::TryCatch.
    // You can also pass another handle as the "this" parameter.
    

        callback->Call(Context::GetCurrent()->Global(), argc, argv);
        

    std::ofstream f;
    f.open ("../log.txt", std::ios_base::app);
      f << "New Search: " << results << std::endl;
    f.close();

    // return scope.Close( output );
    return Undefined();
}



// -------------------------------------------------------------------------
// Sets config file.
// -------------------------------------------------------------------------

Handle<Value> Geolocator_module::initialize( const Arguments& args ) {
    HandleScope scope;

    // Verifies input and constructor call.
    if (args.Length() < 1) { return 
        ThrowException( Exception::TypeError(String::New("Expects config file")));
    }

    v8::String::Utf8Value filename_string(args[0]->ToString());
    std::string config_filename = std::string(*filename_string); 

    Geolocator_module* obj = ObjectWrap::Unwrap<Geolocator_module>(args.This());

    obj->_configFile = config_filename;
    obj->_geo = new geolocate::Geolocator();
    obj->_geo->init(config_filename);

    return scope.Close( String::New( obj->_configFile.c_str() ) );
}

// -------------------------------------------------------------------------
// * @return configuration file name
// -------------------------------------------------------------------------
Handle<Value> Geolocator_module::getConfig( const Arguments& args ) {
    HandleScope scope;
    Geolocator_module* obj = ObjectWrap::Unwrap<Geolocator_module>(args.This());
    return scope.Close( String::New( obj->_configFile.c_str() ) );
}


// -------------------------------------------------------------------------
// Registers the node module
// -------------------------------------------------------------------------
void RegisterModule(Handle<Object> target) { Geolocator_module::Init(target); }
NODE_MODULE(Geolocator_module, RegisterModule);
