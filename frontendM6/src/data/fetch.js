export const loadPosts = async (search) => {
    // carica tutti i post presenti nel blog 
    const urlBase = `http://localhost:5001/blogpost` 
    const urlFetch = search && `?title=${search}`
    console.log(urlBase + urlFetch)
 
    const res = await fetch (urlBase + urlFetch,{
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    })
    
    const data = await res.json()
    console.log(data)
    return data
}

export const loadPost = async (paramsId) => {
    // carica un post specifico presente nel blog 
    console.log(paramsId)
    const res = await fetch ('http://localhost:5001/blogpost/' + paramsId,{
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    })
    const data = await res.json()
    console.log(data)
    return data
}   

export const createOnePost = async (formValue, cover) => {
    // crea un formData per il caricamento di una nuova istanza blogpost che contiene un file da caricare cover
    const formData = new FormData()
    formData.append('cover', cover)
    formData.append('category', formValue.category)
    formData.append('title', formValue.title)
    formData.append('readTime', JSON.stringify(formValue.readTime))
    formData.append('author', formValue.author)
    formData.append('content', formValue.content)
    // formData.append('tags', formValue.tags)
    // non è necessario l'headers perché il browser lo aggiunge da solo calcolando la dimensione del body
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
    formData.append('birthDate', formRegistration.birthDate)
    formData.append('email', formRegistration.email)
    formData.append('password', formRegistration.password)
    formData.append('avatar', avatar)

    console.log(formData.get("name")) // get consente di vedere in debug se effettivamente alla function sia arrivato il valore inserito dall'utente

    const res = await fetch ('http://localhost:5001/api/v1/register', {
        method: 'POST',
        body: formData
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

    if(!res.ok){
        throw new Error(res.status)
    }

    const data = await res.json()
    return data 
}

export const loadComments = async (id) =>{
    const res = await fetch (`http://localhost:5001/blogpost/${id}/comments`,{
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    })
    const data = await res.json();
    return data
}

export const newComment = async (id, formValue) =>{
 
    const res= await fetch (`http://localhost:5001/blogpost/${id}/comments`, {
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`,
            "Content-Type": "application/json"
        },        
        method: "POST",
        body: JSON.stringify(formValue)
    })
    const data = await res.json() 
    return data
} 

/* export const commentAuthor = async (authorId) =>{
    const res= await fetch (`http://localhost:5001/author/${authorId}`, {
        headers: {
            //"Authorization": Bearer ${localStorage.getItem('token')},
            "Content-Type": "application/json"
        },
    })
    const data = await res.json() 
    return data
} */

    export const updateComment = async (blogpostId, commentId, updatedCommentData) => {
        try {
          const response = await fetch(`http://localhost:5001/blogpost/${blogpostId}/comment/${commentId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem('token')}`, // Invia il token JWT per autenticazione
            },
            body: JSON.stringify(updatedCommentData), // Il nuovo contenuto del commento
          });
      
          if (!response.ok) {
            throw new Error("Errore durante l'aggiornamento del commento");
          }
      
          const data = await response.json();
          return data;
        } catch (error) {
          console.error("Errore nell'update del commento:", error);
          throw error;
        }
      };

      export const deleteComment = async (blogpostId, commentId) => {
      /*   try { */
          const response = await fetch(`http://localhost:5001/blogpost/${blogpostId}/comment/${commentId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`,  // Assicurati di avere il token corretto
            },
          });
        
/*           console.log('Stato risposta:', response.status);  // Controlla lo stato della risposta
          if (!response.ok) {
            throw new Error(`Errore nella richiesta: ${response.status}`);
          }
      
          // Se la risposta ha contenuto, analizzalo. Altrimenti, restituisci un oggetto vuoto.
          const responseBody = response.status !== 204 ? await response.text() : null;  // 204 No Content
          return responseBody ? JSON.parse(responseBody) : {};  // Se il corpo è vuoto, non decodificarlo come JSON */
      
 /*        } catch (error) {
          console.error('Errore durante l\'eliminazione del commento:', error);
          throw error;
        } */
      };