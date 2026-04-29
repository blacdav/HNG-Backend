export const genderize = async (prop) => {
    const rqst = await fetch(`https://api.genderize.io?name=${prop}`)

    const resp = await rqst.json()

    return resp;
}

export const agify = async (prop) => {
    const rqst = await fetch(`https://api.agify.io?name=${prop}`)

    const resp = await rqst.json()

    return resp;
}

export const nationalize = async (prop) => {
    const rqst = await fetch(`https://api.nationalize.io?name=${prop}`)

    const resp = await rqst.json()

    return resp;
}