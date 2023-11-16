"use client";

import React, { FormEvent, useEffect, useRef } from "react";
import { Replicache, TEST_LICENSE_KEY, WriteTransaction } from "replicache";
import { useSubscribe } from "replicache-react";
import { nanoid } from "nanoid";
// import Pusher from "pusher-js";
import { Message, MessageWithID } from "@/types";

const rep = process.browser
  ? new Replicache({
      name: "chat-user-id",
      licenseKey: "l00000000000000000000000000000001",
      pushURL: "/api/replicache-push",
      pullURL: "/api/replicache-pull",
      pushDelay: 10000,
      mutators: {
        async createMessage(
          tx: WriteTransaction,
          { id, from, content, order }: MessageWithID
        ) {
          tx.put(`message/${id}`, {
            messageId: id,
            from,
            content,
            order,
          });
        },
        async deleteMessage(tx: WriteTransaction, id: string) {
          tx.del(id);
        },
      },
    })
  : null;

listen();

export default function Home() {
  const messages = useSubscribe(
    rep,
    async (tx) => {
      const list = (await tx
        .scan({ prefix: "message/" })
        .entries()
        .toArray()) as [string, Message][];
      list.sort(([, { order: a }], [, { order: b }]) => a - b);
      return list;
    },
    []
  );

  useEffect(() => console.log(messages), [messages]);

  const usernameRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLInputElement>(null);

  const handleCreateMessage = () => {
    const last = messages.length && messages[messages.length - 1][1];
    const order = (last?.order ?? 0) + 1;

    rep?.mutate.createMessage({
      id: nanoid(),
      from: usernameRef.current.value,
      content: contentRef.current.value,
      order,
    });
    contentRef.current.value = "";
  };

  const handleDeleteMessage = (id: string) => {
    rep?.mutate.deleteMessage(id);
  };
  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCreateMessage();
        }}
      >
        <input ref={usernameRef} required /> says:{" "}
        <input ref={contentRef} required /> <input type="submit" />
      </form>
      <MessageList
        messages={messages}
        handleDeleteMessage={handleDeleteMessage}
      />
    </div>
  );
}

function MessageList({
  messages,
  handleDeleteMessage,
}: {
  messages: any[];
  handleDeleteMessage: (id: string) => void;
}) {
  return messages.map(([k, v]) => {
    return (
      <div key={k} className="flex justify-between">
        <div>
          <b>{v.from}: </b>
          {v.content}
        </div>
        <button onClick={() => handleDeleteMessage(k)}>delete</button>
      </div>
    );
  });
}

function listen() {
  // TODO: Listen for changes on server
}
