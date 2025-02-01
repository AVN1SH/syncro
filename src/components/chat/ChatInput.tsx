"use client";

import { chat } from '@/schemas/chat';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormItem,
  FormField
} from "@/components/ui/form";
import { Input } from '../ui/input';
import { Plus, SmilePlus } from 'lucide-react';
import axios from 'axios';
import qs from "query-string"

interface Props {
  apiUrl : string;
  query : Record<string, any>;
  name : string;
  type : "thread" | "conversation";
}

const ChatInput = ({apiUrl, query, name, type} : Props) => {

  const form = useForm<z.infer<typeof chat>>({
    resolver: zodResolver(chat),
    defaultValues : {
      content : ''
    }
  })

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values : z.infer<typeof chat>) => {
    try {
      const url = qs.stringifyUrl({
        url : apiUrl,
        query
      })

      await axios.post(url, values);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-4 pb-6">
                  <button
                    type="button"
                    onClick={() => {}}
                    className="absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 rounded-md p-1 flex items-center justify-center cursor-pointer"
                  >
                    <Plus className="text-white dark:text-[#313338]" />
                  </button>
                  <Input
                    disabled={isLoading}
                    className="px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-bisible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                    placeholder={`Message ${type === "conversation" ? name : "#" + name}`}
                    {...field}
                  />
                  <div className="absolute top-7 right-8">
                   <SmilePlus />
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}

export default ChatInput
