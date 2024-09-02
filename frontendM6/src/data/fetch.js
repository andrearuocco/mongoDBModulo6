export const loadPosts = async () => {
    // carica tutti i post presenti nel blog 
    const res = await fetch ('http://localhost:5001/blogpost')
    const data = await res.json()
    console.log(data)
    return data
}

export const createOnePost = async (formValue, cover) => {
    const formData = new FormData()
    formData.append('cover', cover)
    formData.append('category', formValue.category)
    formData.append('title', formValue.title)
    formData.append('readTime', JSON.stringify(formValue.readTime))
    formData.append('author', formValue.author)
    formData.append('content', formValue.content)


    const res = await fetch ('http://localhost:5001/blogpost', {
        method: 'POST',
        body: formData
    })

    const data = await res.json()

    return data
}

export const login = async (formValue) => {
    const res = await fetch ('http://localhost:5001/api/v1/login', {
        headers: {
            "Content-Type": "application/json",
        },
        method: 'POST',
        body: JSON.stringify(formValue)
    })

    const data = await res.json()
    return data 
}

export const register = async (formRegistration, avatar) => {
    const formData = new FormData()
    formData.append('name', formRegistration.name)
    formData.append('surname', formRegistration.surname)
    formData.append('avatar', avatar)
    formData.append('birthDate', formRegistration.birthDate)
    formData.append('password', formRegistration.password)
 
    const res = await fetch ('http://localhost:5001/api/v1/register', {
        headers: {
            "Content-Type": "application/json",
        },
        method: 'POST',
        body: JSON.stringify(formRegistration)
    })

    const data = await res.json()
    return data 
}

export const me = async() => {
    const res = await fetch ('http://localhost:5001/api/v1/me', {
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    })

    const data = await res.json()
    return data 
}
