## Working of `forgot password` function for both faculty and admin using OTP and perm token

#  Authentication System flowchart - High level

```mermaid
flowchart TD;
    A[User] -->|forgotPassword| B[forgotPassword endpoint]
    B-->|otp method - faculty, admin users|C[forgotPasswordOTPGet - email, accountType]
    B-->|permToken method - faculty users only|D[forgotPasswordPermTokenPost - permToken, newPassword]
    C-->|get otpTokenId-jwt|E[forgotPasswordVerifyOTPPost - otpId, otpToken]
    E-->|get jwt token|F[forgotPasswordOTPPost - jwtToken, newPassword]
    F-->G[Password change complete]
```  
---

## Controller - Detailed Working
1. `forgotPasswordOTPGet`:
```mermaid
flowchart TD;
    A[User] -->|forgotPasswordGet - email, accountType| B[Check Email]
    B-->|email exist|C[check OTP interval]
    B-->|email not exist|D[response error]
    C-->|verifies OTP interval|E[generate or update otp in db]
    C-->|not verifies OTP interval|D[response error]
    E-->F[send otp to mail]
    F-->G[reponse with `OTP ID - jwt`]
```
2. `forgotPasswordPermTokenPost`:
```mermaid
flowchart TD;
    A[User] -->|forgotPasswordPermTokenPost - permToken, new password| B[Check permToken]
    B-->|permToken verify|C[change password]
    B-->|permToken not verify|D[response error]
    C-->E[response password change successfully]
```
3. `forgotPasswordVerifyOTPPost`:
```mermaid
flowchart TD;
    A[User] -->|forgotPasswordVerifyOTPPost - otpToken, otpId-jwt| B[Check otpToken]
    B-->|otp token verify|C[update otp token as verify: true]
    B-->|otp token not verify|D[response error]
    C-->E[response JWT token of -id, expiredAt]
```  

4. `forgotPasswordOTPPost`:
```mermaid
flowchart TD;
    A[User] -->|forgotPasswordOTPPost - jwtOtpToken-id, expiredAt, newPassword| B[Verify jwt token, expiry]
    B-->|jwt verify|C[check otpId exist in db]
    B-->|jwt not verify|D[check otpId exist in db]
    C-->|otpId  not exist|D[response error]
    C-->|OTPId exist|E[check otp status, verify or not]
    E-->|otp status not verify|D[response error]
    E-->|otp status verify|F[update password]
    F-->G[reponse password changed]
```



#  Change Password Controller - flowchart
```mermaid
flowchart TD;
    A[User] -->|ChangPassword - jwtOtpToken, oldPassword, newPassword| B[Verify jwt token, expiry]
    B-->|verify JWT|C[check old password]
    B-->|jwt not verify|D[error response]
    C-->|old password verify|E[change password]
    C-->|old password not verify|D[error response]
```

