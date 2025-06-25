export type User = {
  name: string
  email: string
  username: string
  _id: string
  description: string
}

export type RegisterForm = Pick<User, 'username' | 'email' | 'name'> & {
  password: string
  password_confirmation: string
}

export type LoginForm = Pick<User, 'email'> & {
  password: string
}