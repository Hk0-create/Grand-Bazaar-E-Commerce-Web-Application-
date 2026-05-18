import passport from 'passport';
import User from '../models/User.model.js';

// Only register Google strategy if credentials are provided
if (
  process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_ID !== 'your_google_client_id' &&
  process.env.GOOGLE_CLIENT_SECRET &&
  process.env.GOOGLE_CLIENT_SECRET !== 'your_google_client_secret'
) {
  const { Strategy: GoogleStrategy } = await import('passport-google-oauth20');

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ googleId: profile.id });
          if (!user) {
            user = await User.findOne({ email: profile.emails[0].value });
            if (user) {
              user.googleId = profile.id;
              user.isVerified = true;
              if (!user.avatar) user.avatar = profile.photos[0]?.value;
              await user.save();
            } else {
              user = await User.create({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                avatar: profile.photos[0]?.value,
                isVerified: true,
                role: 'user',
              });
            }
          }
          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );

  console.log('✅ Google OAuth strategy registered');
} else {
  console.log('⚠️  Google OAuth skipped — GOOGLE_CLIENT_ID not configured in .env');
}

export default passport;
