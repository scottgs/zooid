#include <node.h>
#include <string>
#include <vector>
#include <iterator>
#include <iostream>
#include <fstream>
#include <sstream>

#include "vmr/geolocate/Geolocator.hpp"
#include "Geolocator_module.hpp"
// #include <vmr/geolocate/search/GeolocateSearch.hpp>


// #include <pqxx/pqxx>
// #include "../squiggleMath/test.cpp"
// #include <vmr/aggregation/post_clustering.hpp>
// #include <vmr/web_extensions/web_cpp_extension.hpp>

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



Geolocator_module::Geolocator_module()
    : ObjectWrap() {}



// -----------------------------------------------------------------------------
// Constructer
// -----------------------------------------------------------------------------

Handle<Value> Geolocator_module::New(const Arguments& args) {
    HandleScope scope;

    // Creates a new instance, wraps it, returns it.
    
    Geolocator_module* obj = new Geolocator_module();

    obj->Wrap(args.This());
    return args.This();
}


// -----------------------------------------------------------------------------
// Geolocates a search vector
// -----------------------------------------------------------------------------

Handle<Value> Geolocator_module::Search( const Arguments& args ) {
    HandleScope scope;

    // Cast input values to specific types (array).
    // To*() - http://izs.me/v8-docs/classv8_1_1Value.html

    v8::String::Utf8Value searchString(args[0]->ToString());
    std::string sv = std::string(*searchString); 

    std::vector<std::string> searchVector;

    // prep callback function
    if (!args[1]->IsFunction()) {
        return ThrowException(Exception::TypeError(
            String::New("Second argument must be a callback function")));
    }
    // There's no ToFunction(), use a Cast instead.
    Local<Function> callback = Local<Function>::Cast(args[1]);

    try{


    // dataset specification

    searchVector.push_back(sv);

    std::string dataset = "bamyan_road_full";
    // std::string dataset = "gpu_bamyan_road_360";
    // GPU_BAMYAN_ROAD_360
    int resultCount     = 3;
    int scoreBoundary   = 8;

    // unwrap Geolocator object
    Geolocator_module* obj = ObjectWrap::Unwrap<Geolocator_module>(args.This());



    std::vector<ClusterResult*>* results = obj->_geo->search( searchVector, dataset, resultCount, scoreBoundary );

    std::cout << results->size() << std::endl;

    Handle<v8::Array> output = Array::New(results->size());

    // Handle<Object> res = Handle<Object>::Cast(results);

    // v8::External<v8::Value> out = v8::External::New(&results);
    // Local<Object> out = Local<Object>::Cast(&results);

    // for (uint32_t i = 0; i < input->Length(); i++){
    //     squiggle.push_back( input->Get(i)->NumberValue() );
    // }

    uint32_t ttt = 1;
    float yyy = 12.123123;

    // output->Set( ttt, Number::New( static_cast<double>( yyy ) ) );
    // output->Set( ttt, Number::New( static_cast<double>( results->at(0)->lat_mode ) ) );


    for(uint32_t i = 0; i < 3; i++){

        // output->Set( i, Number::New( yyy ) );

        // v8::Local<v8::Array> tmp = v8::Array::New(10);
        // output->Set( i, Object::Cast( results->at(i)->lat_mode ) );

        // String::Utf8Value param1( results->at(i)->lat_mode.str() );

        // for (uint32_t j = 0; j < 4; j++){


        //     output->Set( i + j++, Number::New( results->at(i)->avg_score ) );
        //     output->Set( i + j++, Number::New( results->at(i)->lat_mode ) );
        //     output->Set( i + j++, Number::New( results->at(i)->lon_mode ) );
        //     output->Set( i + j  , Number::New( results->at(i)->avg_orientation ) );
        
        // }

        // v8::Handle<v8::Array> points = v8::Array::New(10);
        // for (uint32_t j = 0; j < results->at(i)->points->size() ; j++){
        //     points->Set( j , Number::New( results->at(i)->avg_score ) );
        //     // points->Set( j , Number::New( results->at(i)->points->at(j)->lat ) )
        // }
        // output->Set( i, Array::New( results->at(i)->points ) );


    }


    // std::string text = "Asd";
    // int i = 5;

    // std::ostringstream oss;

    // oss << text << i;
    // std::cout << oss.str();



//  cr->lat_mode = 40.00;
// 37          cr->lon_mode = 50.00;
// 38          cr->avg_orientation = 125.00;
// 39          cr->avg_score = 100.00;
// 40          cr->points = new std::vector<ResultPoint*>;
// 41          ResultPoint* rp = new ResultPoint;
// 42          rp->lat = 38.00;
// 43          rp->lon = -92.00;
// 44          rp->orientation;
// 45          rp->score;
// 46          cr->points->push_back(rp);
// 47          results->push_back(cr);


        const unsigned argc = 3;
        Local<Value> argv[argc] = {
            Local<Value>::New(String::New("What the Shit!?!")),
            Local<Value>::New(output),
            Local<Value>::New(Integer::New(42))
        };

        // Note: When calling this in an asynchronous function that just returned
        // from the threadpool, you have to wrap this in a v8::TryCatch.
        // You can also pass another handle as the "this" parameter.
        

        callback->Call(Context::GetCurrent()->Global(), argc, argv);
            

    } catch(int err){

    }



    // std::ofstream f;
    // f.open ("log.txt", std::ios_base::app);
    //   f << "New Search: " << results << std::endl;
    // f.close();

    // return scope.Close( output );
    return Undefined();
}


// -------------------------------------------------------------------------
// Intitiates with config file
// -------------------------------------------------------------------------

Handle<Value> Geolocator_module::getConfig( const Arguments& args ) {
    HandleScope scope;
    Geolocator_module* obj = ObjectWrap::Unwrap<Geolocator_module>(args.This());
    return scope.Close( String::New( obj->_configFile.c_str() ) );
}



// -------------------------------------------------------------------------
// Retrieves Config filename from object.
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
    // return scope.Close( Boolean::New( obj->geo.init(config_filename) ) );
}

// -------------------------------------------------------------------------
// Registers the node module
// -------------------------------------------------------------------------

void RegisterModule(Handle<Object> target) { Geolocator_module::Init(target); }
NODE_MODULE(Geolocator_module, RegisterModule);
