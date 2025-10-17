import app from './app';
import { ENV } from './app/config';
import connectDB from './app/config/db';
import seedSuperAdmin from './app/config/seedSuperAdmin';

(async () => {
  try {
    await connectDB();
    // Seed super admin
    await seedSuperAdmin();
    app.listen(ENV.port, () => {
      console.log(`Server started on http://localhost:${ENV.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();
