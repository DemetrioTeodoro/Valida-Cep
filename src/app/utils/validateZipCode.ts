export const validateZipCode = (cep: string): boolean => {
    try {
        const trimmedCep = cep.trim();
        if (trimmedCep === "" || isNaN(Number(trimmedCep))) {
            return false;
        }
        if (trimmedCep.length !== 8) {
            return false;
        }
        return true;
    } catch (error) {
        return false;
    }
};