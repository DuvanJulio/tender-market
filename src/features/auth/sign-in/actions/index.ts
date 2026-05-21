import { SignInFormData, SignInResponse } from '../interfaces';

export async function signInAction(data: SignInFormData): Promise<SignInResponse> {
  const res = await fetch('/api/auth/sign-in', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const json: SignInResponse = await res.json();
  return json;
}
