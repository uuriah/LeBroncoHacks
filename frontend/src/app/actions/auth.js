// app/actions/auth.js
'use server';

export async function signup({ email, password }) {
  console.log('Signup called with:', email, password);
  return { success: true };
}