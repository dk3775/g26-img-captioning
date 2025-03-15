import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";

const INTERESTS = [
  "Art & Design",
  "Photography",
  "Marketing",
  "Social Media",
  "Education",
  "Research",
  "Personal Projects",
  "Business",
  "Other"
];

const OCCUPATIONS = [
  "Educator",
  "Student",
  "Hobbyist",
  "Professional",
  "Other"
];

const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Japan",
  "India",
  "Brazil",
  "Spain",
  "Italy",
  "Netherlands",
  "Sweden",
  "Singapore",
  "South Korea",
  "Other"
];

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return <FormMessage message={searchParams} />;
  }

  return (
    <div className="bg-black/30 p-8 rounded-2xl backdrop-blur-xl border border-gray-800 shadow-xl w-full max-w-4xl">
      <form className="flex flex-col w-full">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Sign up
        </h1>
        <p className="text-sm text-gray-300 mb-6">
          Already have an account?{" "}
          <Link className="text-blue-400 hover:text-blue-300 font-medium" href="/sign-in">
            Sign in
          </Link>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input name="email" type="email" placeholder="you@example.com" required />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                name="password"
                placeholder="Your password"
                minLength={6}
                required
              />
            </div>

            <div>
              <Label htmlFor="full_name">Full Name</Label>
              <Input name="full_name" placeholder="John Doe" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="age">Age</Label>
                <Input name="age" type="number" min="13" max="120" required />
              </div>
              
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select name="gender" required>
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="occupation">Occupation</Label>
              <Select name="occupation" required>
                <option value="">Select occupation</option>
                {OCCUPATIONS.map((occupation) => (
                  <option key={occupation} value={occupation.toLowerCase()}>
                    {occupation}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="country">Country</Label>
              <Select name="country" required>
                <option value="">Select country</option>
                {COUNTRIES.map((country) => (
                  <option key={country} value={country.toLowerCase()}>
                    {country}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label htmlFor="interests">Interests (Select multiple)</Label>
              <Select 
                name="interests" 
                multiple 
                required
                className="min-h-[120px]"
              >
                {INTERESTS.map((interest) => (
                  <option key={interest} value={interest}>{interest}</option>
                ))}
              </Select>
            </div>

            <div>
              <Label htmlFor="usage_purpose">How do you plan to use our app?</Label>
              <Textarea 
                name="usage_purpose" 
                placeholder="Tell us about your goals and how you plan to use our app..."
                className="min-h-[120px]"
                required
              />
            </div>
          </div>
        </div>

        {/* Footer - Full Width */}
        <div className="mt-6 space-y-4">
          <SubmitButton 
            formAction={signUpAction} 
            pendingText="Signing up..."
            className="w-full"
          >
            Sign up
          </SubmitButton>
          <FormMessage message={searchParams} />
        </div>
      </form>
      <SmtpMessage />
    </div>
  );
}
