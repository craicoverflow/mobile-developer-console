import {
    SERVICE_BINDINGS_REQUEST, SERVICE_BINDINGS_SUCCESS, SERVICE_BINDINGS_FAILURE,
    SERVICE_BINDING_CREATE_REQUEST, SERVICE_BINDING_CREATE_SUCCESS, SERVICE_BINDING_CREATE_FAILURE,
    SERVICE_BINDING_DELETE_REQUEST, SERVICE_BINDING_DELETE_SUCCESS, SERVICE_BINDING_DELETE_FAILURE,
  } from '../actions/serviceBinding';
  import resourceReducer from './resource';
  
  const serviceBindings = resourceReducer({
    readRequest: SERVICE_BINDINGS_REQUEST,
    readSuccess: SERVICE_BINDINGS_SUCCESS,
    readFailure: SERVICE_BINDINGS_FAILURE,
    createRequest: SERVICE_BINDING_CREATE_REQUEST,
    createSuccess: SERVICE_BINDING_CREATE_SUCCESS,
    createFailure: SERVICE_BINDING_CREATE_FAILURE,
    deleteRequest: SERVICE_BINDING_DELETE_REQUEST,
    deleteSuccess: SERVICE_BINDING_DELETE_SUCCESS,
    deleteFailure: SERVICE_BINDING_DELETE_FAILURE,
  });
  
  export default serviceBindings;
  