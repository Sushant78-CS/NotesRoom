package com.example.NotesRoom.config;

import com.example.NotesRoom.entity.Users;
import com.example.NotesRoom.repository.UserRepository;
import com.example.NotesRoom.service.JwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final CustomUserDetailsService customUserDetailsService;
    private final HandlerExceptionResolver handlerExceptionResolver;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String path = request.getServletPath();
        if (path.startsWith("/auth") || path.startsWith("/files")) {
            filterChain.doFilter(request, response);
            return;
        }
        log.info("incoming request {}", request.getRequestURI());
        String authHeader = request.getHeader("Authorization");
        System.out.println("HEADER => " + authHeader);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }
        String token = authHeader.substring(7);
        try {
            Claims claims = jwtService.extractClaims(token);
            if (!"access".equals(claims.get("typ"))) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }
//            String username = jwtService.getUsernameFromToken(token);
            String username = claims.getSubject();
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails user = customUserDetailsService.loadUserByUsername(username);

                if (jwtService.validateToken(username, user, token)) {
                    UsernamePasswordAuthenticationToken token1 = new UsernamePasswordAuthenticationToken(
                            user, null, user.getAuthorities());

                    token1.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(token1);
                }
            }
        } catch (io.jsonwebtoken.ExpiredJwtException e) {
            log.warn("Access token expired");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Token expired\"}");
            return;
        } catch (Exception e) {
            log.error("JWT error", e);
            SecurityContextHolder.clearContext();
        }
        filterChain.doFilter(request, response);
    }

}
