export type User = {
  name: string
  email: string
  username: string
}

export type RegisterForm = Pick<User, 'username' | 'email' | 'name'> & {
  password: string
  password_confirmation: string
}