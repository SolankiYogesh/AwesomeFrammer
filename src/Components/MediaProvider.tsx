import React, {createContext, useEffect} from 'react'
import _, {cloneDeep} from 'lodash'

import {useStateRef} from '@/Hooks'
import {Constants, Storage} from '@/Theme'

export const MediaContext = createContext<{
  posts: MediaType[]
  addPost: (postsMedia: MediaType[]) => void
  removePosts: (ids: string[]) => void
  clearData: () => void
}>({} as any)

export default ({children}: {children: React.ReactNode}) => {
  const [posts, setPosts, postRef] = useStateRef<MediaType[]>([])

  const addPost = (postsMedia: MediaType[]) => {
    if (!posts) {
      return []
    }
    setPosts((state) => {
      const data = _.unionBy([...state, ...postsMedia], 'id')
      Storage.delete(Constants.asyncStorageKeys.posts)
      Storage.set(Constants.asyncStorageKeys.posts, JSON.stringify(data))
      return data
    })
  }

  const removePosts = (ids: string[]) => {
    setPosts((state) => {
      const clone = cloneDeep(state)
      if (!clone) {
        return []
      }
      const filter = _.filter(clone, ({id}) => !ids.includes(id))
      Storage.delete(Constants.asyncStorageKeys.posts)
      Storage.set(Constants.asyncStorageKeys.posts, JSON.stringify(filter))
      return filter
    })
  }

  const clearData = () => {
    setPosts(cloneDeep([]))
  }

  useEffect(() => {
    const postData = Storage.getString('POSTS')
    if (postData) {
      const data = JSON.parse(postData)

      setPosts(data)
    }
  }, [setPosts])

  return (
    <MediaContext.Provider value={{posts: postRef.current, addPost, clearData, removePosts}}>
      {children}
    </MediaContext.Provider>
  )
}
