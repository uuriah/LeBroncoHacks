// app/actions/auth.js
'use server';

import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { redirect } from "next/navigation";

export async function signup(formData) {
  const email = formData.get('email');
  const password = formData.get('password');
  const name = formData.get('name');

  if (!email || !password || !name) {
    return { error: 'All fields are required' };
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    if (user) {
      redirect('/dashboard');
    }
  } catch (error) {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return { error: 'Email already registered' };
      case 'auth/invalid-email':
        return { error: 'Invalid email address' };
      case 'auth/operation-not-allowed':
        return { error: 'Operation not allowed' };
      case 'auth/weak-password':
        return { error: 'Password is too weak' };
      default:
        return { error: 'Something went wrong' };
    }
  }
}

export async function login(formData) {
  const email = formData.get('email');
  const password = formData.get('password');

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    if (user) {
      redirect('/dashboard');
    }
  } catch (error) {
    switch (error.code) {
      case 'auth/invalid-email':
        return { error: 'Invalid email address' };
      case 'auth/user-disabled':
        return { error: 'This account has been disabled' };
      case 'auth/user-not-found':
        return { error: 'No account found with this email' };
      case 'auth/wrong-password':
        return { error: 'Incorrect password' };
      default:
        return { error: 'Something went wrong' };
    }
  }
}