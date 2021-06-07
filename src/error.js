class APIError extends Error {

    /**
     * @param params - Параметры ошибки.
     */

    constructor(params) {
        super(params.msg)
        this.code = params.code;
        this.msg = params.msg;
        Error.captureStackTrace(this, this.constructor);
    };
};

export default { APIError };
