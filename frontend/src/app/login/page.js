import React from "react";
import Link from "next/link";
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { signup } from '@/app/actions/auth';

export default function Login() {
  return (
    <div className="relative w-full h-screen">
      <Image
        src="/clothingStore.jpeg"
        alt="Background Image"
        fill
        className="object-cover z-0"
        priority
      />

      <main className="absolute inset-0 flex flex-col items-center justify-center px-4 py-12 z-10 bg-white/0 backdrop-blur-sm">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="p-8">
            <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
              Log in
            </h1>

            {/* <form action={signup} className="space-y-6">
              <div className="flex flex-col">
                <label htmlFor="name" className="mb-1 text-sm font-medium text-gray-700">Name</label>
                <input
                  id="name"
                  name="name"
                  placeholder="Your Name"
                  className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                /> */}
              {/* </div> */}

              <div className="flex flex-col">
                <label htmlFor="email" className="mb-1 text-sm font-medium text-gray-700">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="password" className="mb-1 text-sm font-medium text-gray-700">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <Button type="submit" className="w-full py-2 text-lg">
                Log in 
              </Button>

            <p className="mt-4 text-center text-sm text-gray-600">
              Don't have an account? <Link href="/signup" className="text-blue-600 hover:underline">Log in</Link>
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}