import dynamic from 'next/dynamic'

const Todo = dynamic(() => import('@/components/Todo'), { ssr: false })

export default function Home() {
  return <Todo />
}
