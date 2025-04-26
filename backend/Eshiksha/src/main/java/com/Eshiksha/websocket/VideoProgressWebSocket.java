package com.Eshiksha.websocket;

import jakarta.websocket.OnClose;
import jakarta.websocket.OnError;
import jakarta.websocket.OnOpen;
import jakarta.websocket.Session;
import jakarta.websocket.server.PathParam;
import jakarta.websocket.server.ServerEndpoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
@ServerEndpoint("/progress/{courseId}")
public class VideoProgressWebSocket {

    private final Object lock = new Object();

    private static Map<String, Session> sessions = new ConcurrentHashMap<>();

    @OnOpen
    public void onOpen(Session session, @PathParam("courseId") String courseId) {
        sessions.put(courseId, session);
        System.out.println("websocket connections gets opened...");
    }

    @OnClose
    public void onClose(Session session, @PathParam("courseId") String courseId) {
        sessions.remove(courseId);
        System.out.println("websocket connections gets closed...");

    }

    @OnError
    public void onError(Session session, Throwable throwable) {
        System.err.println("Error occurred " + throwable.getMessage());
        throwable.printStackTrace();
    }

    public void sendProgress(String courseId, String message) {
        System.out.println("progress is bieng sent...");
        Session session = sessions.get(courseId);
        if (session != null && session.isOpen()) {
            synchronized (lock) {
                try {
                    session.getBasicRemote().sendText(message);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }
}