import type { User } from '@supabase/supabase-js';

type UserImage = {
  url: string;
  alt: string;
};

type ExtendedUser = User & {
  image?: UserImage | null;
};
