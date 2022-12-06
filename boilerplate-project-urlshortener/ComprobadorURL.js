
//Devulve True si es una url y false si no

function esURLCorrecta(url) {

    try {
        return Boolean(new URL(url))
    } catch (e) {
        return false;
    }
}

module.exports = esURLCorrecta;