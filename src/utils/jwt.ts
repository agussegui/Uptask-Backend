import jwt from 'jsonwebtoken'
import Types from 'mongoose'

type UserPayload = {
    id: Types.ObjectId
}

//sing significa crear un webToken
export const generateJWT = (payload: UserPayload) => {
    
    //expiresIn significa cuanto tiempo de validez va a tener
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '180d'
    })
    return token
}