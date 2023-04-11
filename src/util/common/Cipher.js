/**
 * Fecha creacion: 24/01/2020
 * @author Anthony Reinoso.
 *
 * Libreria para cifrado AES, android, ios.
 * This exposes the native Cipher module as a JS module. This has
 * the following functions:
 *
 * 'encript' which takes the following parameters:
 * 1. String data: The string to encrypt
 */
import CryptoJS from "crypto-js";
import { parameters } from "./const.js";

export default {
    encrypting(data) {
        var key = CryptoJS.enc.Utf8.parse(parameters.cipherKey);
        var iv = CryptoJS.enc.Utf8.parse(parameters.cipherIV);
        return CryptoJS.AES.encrypt(data, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7}).toString();
    },

    decrypting(data) {
        var key = CryptoJS.enc.Utf8.parse(parameters.cipherKey);
        var iv = CryptoJS.enc.Utf8.parse(parameters.cipherIV);

        var bytes = CryptoJS.AES.decrypt(data, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7});
        return bytes.toString(CryptoJS.enc.Utf8);
    }};
