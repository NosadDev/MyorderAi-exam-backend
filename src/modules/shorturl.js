export function randomHash(length) {
    let result = '';
    const charList = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        result += charList.charAt(Math.floor(Math.random() * charList.length));
    }
    return result;
}