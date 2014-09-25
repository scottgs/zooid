
Handle<Value> Async(const Arguments& args);
void AsyncWork(uv_work_t* req);
void AsyncAfter(uv_work_t* req);


// makes struct for asynchronous work request
struct Baton {

    Persistent<Function> callback;
    bool error;
    std::string error_message;

    std::string dataset;
    int32_t resultCount;
    int32_t scoreBoundary;
    int32_t result;

    std::vector<ClusterResult*>* results;
    std::vector<std::string> sv;
    
    geolocate::Geolocator* _geo;

};



// Creates a work request object and schedules it for execution.
Handle<Value> Async(const Arguments& args) {
    HandleScope scope;

    if (!args[1]->IsFunction()) {
        return ThrowException(Exception::TypeError(
            String::New("First argument must be a callback function")));
    }

    // cast callback to fnuction
    Local<Function> callback = Local<Function>::Cast(args[1]);

    
    // Puts all our shit in the baton
    
    Baton* baton = new Baton();

    baton->error = false;
    baton->callback = Persistent<Function>::New(callback);

    // sets search vector as string
    v8::String::Utf8Value searchString(args[0]->ToString());
    std::string sv = std::string(*searchString); 
    baton->sv.push_back(sv);

    baton->dataset = "bamyan_road_full";
    baton->resultCount     = 1000;
    baton->scoreBoundary   = 8;

    std::string config_filename = "/etc/vmr/geolocate.conf";
    baton->_geo = new geolocate::Geolocator();
    baton->_geo->init(config_filename);


    // creates the work request struct.
    uv_work_t *req = new uv_work_t();
    req->data = baton;

    // Schedules with libuv. specifies the functions
    // that should be executed in the threadpool and back in the main thread
    // after the threadpool function completed.
    int status = uv_queue_work(uv_default_loop(), req, AsyncWork,
                               (uv_after_work_cb)AsyncAfter);
    assert(status == 0);

    return Undefined();
}



// Do not v8 here !!!
void AsyncWork(uv_work_t* req) {
    Baton* baton = static_cast<Baton*>(req->data);

    // Do work in threadpool here.
    baton->results = baton->_geo->search(baton->sv, baton->dataset, baton->resultCount, baton->scoreBoundary);
    baton->result  = 9999999;

    // Remember to baton->error!
}




// v8 safe
void AsyncAfter(uv_work_t* req) {
    HandleScope scope;
    Baton* baton = static_cast<Baton*>(req->data);

    // handles error
    if (baton->error) {
        Local<Value> err = Exception::Error(String::New(baton->error_message.c_str()));
        // Prepares parameters for the callback function.
        const unsigned argc = 1;
        Local<Value> argv[argc] = { err };
        TryCatch try_catch;
        baton->callback->Call(Context::GetCurrent()->Global(), argc, argv);
        if (try_catch.HasCaught()) { node::FatalException(try_catch); }
    } else {

        // Prepares parameters for the callback function.
        // first arg is error, then results

        Local<v8::Array> output = Array::New(baton->results->size());

        std::cout << "\n\nvec<result>->size() = " << baton->results->size() << std::endl;

        output->Set( 0, Number::New( baton->results->size() ) );

        const unsigned argc = 3;
        Local<Value> argv[argc] = {
            Local<Value>::New(Null()),
            output,
            Local<Value>::New(Integer::New(baton->result))
        };

        TryCatch try_catch;
        baton->callback->Call(Context::GetCurrent()->Global(), argc, argv);
        if (try_catch.HasCaught()) {
            node::FatalException(try_catch);
        }
    }

    // trashes the callback
    baton->callback.Dispose();

    // trashes the work reqeusts
    delete baton;
    delete req;
}