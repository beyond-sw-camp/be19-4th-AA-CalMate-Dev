package com.ateam.calmate.security;

import com.ateam.calmate.member.command.service.RefreshTokenService;
import jakarta.servlet.Filter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Collections;
import java.util.List;

/* ?�명. Spring Security 모듈 추�? ??default 로그???�이지 ?�거 �??��? ?�정 */
/* ?�기. 조립 + ?��?�??�는 부�?*/
@Configuration
public class WebSecurity {

    private JwtAuthenticationProvider jwtAuthenticationProvider;
    private Environment env;        // JWT Token??payload??만료?�간 만들기위??추�?
    private JwtFactory jwtFactory;
    private CookieUtil  cookieUtil;
    private RefreshTokenService refreshTokenService;
    @Value("${token.refresh.expiration_time}") long refreshTtlMs;

    @Autowired
    public WebSecurity(JwtAuthenticationProvider jwtAuthenticationProvider, Environment env,
                       JwtFactory jwtFactory, CookieUtil  cookieUtil,
                       RefreshTokenService refreshTokenService
    ) {
        this.jwtAuthenticationProvider = jwtAuthenticationProvider;
        this.env = env;
        this.jwtFactory = jwtFactory;
        this.cookieUtil = cookieUtil;
        this.refreshTokenService = refreshTokenService;
    }

    /* ?�명. ?�로 ?�성???�로바이??bean?�로 ?�록 */
    @Bean
    public AuthenticationManager authenticationManager() throws Exception {
        return new ProviderManager(Collections.singletonList(jwtAuthenticationProvider));
    }

    @Bean
    protected SecurityFilterChain securityFilterChain(HttpSecurity http,
                                                      JwtUtil jwtUtil,
                                                      JsonAuthFailureHandler failure,
                                                      JsonAuthSuccessHandler success) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults()) // cors ?�정
                // 기본 formLogin ?�터 비활?�화 (중복 방�?)
                .formLogin(AbstractHttpConfigurer::disable);

        http.authorizeHttpRequests(authz ->
                                authz
                                        .requestMatchers(HttpMethod.OPTIONS,"/**").permitAll()     // ?�스?��? ?�해 모든 권한 ?�픈
//                                        .requestMatchers("/**").permitAll()

                                        /* ??관리자�??�근 가??(hasRole/hasAuthority) ---------- */
                                        // hasRole("ADMIN")???��??�으�?"ROLE_ADMIN" 권한??찾습?�다.
                                        // DB/?�큰??"ROLE_ADMIN"???�었?�면 hasAuthority("ROLE_ADMIN")???�일 ?�과
//                                        .requestMatchers("/admin/**").hasRole("ADMIN")
//
//                                        /* ??로그?�된 ?�원�??�근 가??(authenticated) --------- */
                                        .requestMatchers("/member/refresh").permitAll()
                                        .requestMatchers("/member/logout").permitAll()
                                        .requestMatchers(HttpMethod.GET, "/img/**").permitAll()     // �̹��� ���?����
                                        .requestMatchers(HttpMethod.GET, "/uploads/**").permitAll() // ���ε� ���� ��ȸ ���?
                                        .requestMatchers("/health").permitAll()

                                        // 커�??�티 조회??모두 ?�용
                                        .requestMatchers(HttpMethod.GET, "/community/posts").permitAll()
                                                                                .requestMatchers("/api/calendar/**").permitAll() // Ķ���� ��ȸ ����
                                        .requestMatchers(HttpMethod.GET, "/community/post/*").permitAll()
                                        .requestMatchers(HttpMethod.GET, "/community/post/*/comments").permitAll()
                                        .requestMatchers(HttpMethod.GET, "/community/ranking").permitAll()

                                        // 커�??�티 ?��? (?�성/?�정/??��)
                                        .requestMatchers(HttpMethod.POST, "/community/post/*/comments").authenticated()
                                        .requestMatchers(HttpMethod.PATCH, "/community/post/*/comments/*").authenticated()
                                        .requestMatchers(HttpMethod.DELETE, "/community/post/*/comments/*").authenticated()

                                        // 게시글 (?�성/?�정/??��)
                                        .requestMatchers(HttpMethod.POST, "/community/post").authenticated()     // ?�큰?�문???�되�?permitAll()�??�정
                                        .requestMatchers(HttpMethod.PATCH, "/community/post/*").authenticated()  // ?�큰?�문???�되�?permitAll()�??�정
                                        .requestMatchers(HttpMethod.DELETE, "/community/post/*").authenticated() // ?�큰?�문???�되�?permitAll()�??�정

                                        // 게시글 �??��? 좋아??
                                        .requestMatchers(HttpMethod.POST, "/community/post/*/like").authenticated()
                                        .requestMatchers(HttpMethod.POST, "/community/comment/*/like").authenticated()

                                        // 빙고 이벤트 API (테스트를 위해 임시로 모두 허용)
                                        .requestMatchers(HttpMethod.GET, "/api/bingo/**").permitAll()
                                        .requestMatchers(HttpMethod.POST, "/api/bingo/**").permitAll()
                                        .requestMatchers(HttpMethod.DELETE, "/api/bingo/**").permitAll()

                                        // 가챠 이벤트 API (테스트를 위해 임시로 모두 허용)
                                        .requestMatchers("/api/gacha/**").permitAll()

                                        // 포인트 API (테스트를 위해 임시로 모두 허용)
                                        .requestMatchers("/api/event/points/**").permitAll()

                                        // 업로드 파일 접근
                                        .requestMatchers("/uploads/**").permitAll()

                                        // WebSocket 엔드포인트 허용
                                        .requestMatchers("/ws-gacha/**").permitAll()

//                                        .requestMatchers(
//                                                "/v3/api-docs/**",
//                                                "/swagger-ui/**",
//                                                "/swagger-ui.html",
//                                                "/swagger-resources/**",
//                                                "/webjars/**"
//                                        ).permitAll()
//                                authz.requestMatchers(HttpMethod.GET, "/member/**").permitAll()
//                                        .requestMatchers(HttpMethod.POST, "/users/**").permitAll()
//                                        .requestMatchers(HttpMethod.GET, "/test").permitAll()
//                                        .requestMatchers("/actuator/**").permitAll()
//                                        .requestMatchers(HttpMethod.GET, "/member/**").hasRole("ADMIN")
//                                        .requestMatchers(HttpMethod.GET, "/users/**").hasAnyRole("ENTERPRISE","ADMIN")
//                                        .requestMatchers(HttpMethod.GET, "/test1/**", "/test2/**").hasAnyRole("ENTERPRISE","ADMIN")
                                        .anyRequest().authenticated()
                )
                /* ?�명. Session 방식???�닌 JWT Token 방식???�용?�겠?? */
                /* ?�명. Session 방식???�닌 JWT Token 방식?�로 ?�증???�원(Authentication)??Local Thread�?지?�하겠다. */
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        /* ?�명. 매니?��?지???�터 ?�록 */
        http.addFilter(getAuthenticationFilter(authenticationManager(),failure, success));

        /* ?�명. 로그???�후 ?�큰???�고 ?�다�?JwtFilter�?추�??�서 검증하?�록 ??*/
        /* ?�명. UsernamePasswordAuthenticationFilter 보다 JwtFilter가 먼�? ?�행 ?�게 ??*/
        http.addFilterBefore(new JwtFilter(jwtUtil), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // cors�??�해 추�?
    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173")); // * 금�?(?�리?�셜 ?�면)
        config.setAllowedMethods(List.of("GET","POST","PUT","DELETE","PATCH","OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        // 브라?��?가 ?�을 ???�도�??�출
        config.setExposedHeaders(List.of("token", "Authorization"));
        config.setAllowCredentials(true); // ?�션/쿠키 ????
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    /* ?�명. Filter�??�록?�기 ?�해 ?�용?�는 메소??*/
    private Filter getAuthenticationFilter(AuthenticationManager authenticationManager
            , JsonAuthFailureHandler failure
            , JsonAuthSuccessHandler  success) throws Exception {
        AuthenticationFilter authenticationFilter = new AuthenticationFilter(authenticationManager, env, jwtFactory,
                cookieUtil, refreshTokenService, refreshTtlMs);
        authenticationFilter.setAuthenticationFailureHandler(failure);
        authenticationFilter.setAuthenticationSuccessHandler(success);
        return authenticationFilter;
    }


}



