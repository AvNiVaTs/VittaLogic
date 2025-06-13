class ApiErr extends Error {
    constructor(
        statusCode,
        message="Something went wrong",
        errors = [],
        stack = ""
    ){
        super(message) //calling constructor of parent class

        this.data = null
        this.message = message
        this.success = false
        this.errors = errors
        
        if(stack) this.stack = stack
        else Error.captureStackTrace(this, this.constructor)
    }
}

export { ApiErr }