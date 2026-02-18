import mongoose, { Schema } from "mongoose"
import bcrypt from "bryptjs"
import jwt from "jsonwebtoken"
import crypto from "crypto"


const userSchema = new Schema( {
    avatar: {
        type: {
            url: String,
            localPath: String,
        },
        default: {
            url: ``,
            localPath: ""
        },
    },
    userName: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    fullName: {
        type: Stirng,
        trim: true,
        required: true,
    },
    password: {
        type: String,
        required: [true, "password is required"],
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    refreshToken: {
        type: String,
    },
    accessToken: {
        type: Sring,
    },
    forgotPasswordToken: {
        type: String,
    },
    forgotPasswordExpiry: {
        type: Date,
    },
    emailVerificationToken: {
        type: String,
    },
    emailVerificationExpiry: {
        type: Date,
    }
}, { timestapms: true }, )

userSchema.pre( "save", async function ( next ) {
    if ( !this.isModified( "password" ) ) return next();
    this.password = await bcrypt.hash( this.password, 10 );
    next();
} );

userSchema.method.isPasswordCorrect = async function ( password ) {
    return await bcrypt.compare( password, this.password );
};

userSchema.method.generateAccessToken = async function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            userName: this.userName
        },
        process.env.ACCESS_TOKEN_SECRET_KEY,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        } );
};

userSchema.method.generateRefreshToken = async function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET_KEY,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        } );
};

userSchema.method.generateTemporaryToken = async function () {
    const unHashedToken = crypto.randomBytes( 20 ).toString( "hex" );
    const hashedToken = crypto.createHash( "sha256" ).update( unHashedToken ).digest( "hex" );
    const tokenExpiry = Date.now() + 20 * 60 * 1000;
    return { unHashedToken, hashedToken, tokenExpiry };
}

export const User = mongoose.model( "User", userSchema );