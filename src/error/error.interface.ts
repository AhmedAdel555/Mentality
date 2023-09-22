interface IError{
  name?: string;
  message?: string;
  stack?: string;
  statusCode?: number;
};

export default IError;
