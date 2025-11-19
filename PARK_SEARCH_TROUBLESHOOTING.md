# Park Search Troubleshooting Guide

## Issue: Park Not Appearing in Search Results

If you've added a park but it's not showing up in search results, the most common reason is that **the park submission is still pending approval**.

### How the System Works

1. **Park Submissions** are stored in the `park_submissions` table in Supabase
2. **Search Results** only include parks with `status = 'approved'`
3. **New Submissions** default to `status = 'pending'` and require admin approval

### Quick Diagnosis

Run this command to check your park's status:

```bash
node check-park-status.js "Barking Hound Village Inn"
```

This will show you:
- Whether the park exists in the database
- Its current status (pending/approved/rejected)
- When it was created
- When it was approved (if applicable)

### Solution: Approve the Park

#### Option 1: Using the Admin Dashboard (Recommended)

1. **Navigate to Admin Dashboard:**
   - Go to `/admin` in your browser
   - You must be logged in as an admin user

2. **Find the Park:**
   - The dashboard shows all submissions
   - Filter by "Pending" to see unapproved parks
   - Search for "Barking Hound Village Inn"

3. **Approve the Park:**
   - Click the "Approve" button next to the park
   - The park will immediately appear in search results

#### Option 2: Using the API Directly

If you have admin access, you can approve via API:

```bash
# First, get the submission ID from check-park-status.js
# Then make a POST request:

curl -X POST http://localhost:3000/api/admin/submissions/approve \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{"submissionId": "PARK_SUBMISSION_ID"}'
```

#### Option 3: Direct Database Update (Advanced)

If you have direct database access:

```sql
-- Find the park
SELECT id, name, status FROM park_submissions 
WHERE name ILIKE '%Barking Hound Village Inn%';

-- Approve it (replace SUBMISSION_ID with actual ID)
UPDATE park_submissions 
SET 
  status = 'approved',
  approved_at = NOW(),
  approved_by = 'YOUR_USER_ID'
WHERE id = 'SUBMISSION_ID';
```

### Verify It's Working

After approving:

1. **Wait a few seconds** for the cache to refresh
2. **Search for the park** on the homepage
3. **Try different search terms:**
   - "Barking Hound"
   - "Atlanta"
   - "Georgia"
   - "dog daycare"

### Common Issues

#### Issue: "No park found with that name"

**Possible causes:**
- The park wasn't successfully submitted
- The name in the database is slightly different
- There was an error during submission

**Solution:**
- Check the browser console for errors during submission
- Check the `/api/parks/submit` endpoint logs
- Try searching with partial names in the database

#### Issue: "Park is approved but still not showing"

**Possible causes:**
- Cache hasn't refreshed yet (wait 1-2 minutes)
- Search term doesn't match (try different terms)
- There's a filter applied (clear all filters)
- The park is in a different state (e.g., Georgia vs California)

**Solution:**
- Clear browser cache
- Try searching with just the city name
- Check if there are any active filters on the search page
- Verify the park's state matches your search location

#### Issue: "I don't have admin access"

**Solution:**
- Contact the site administrator
- Or update your user role in Supabase:
  ```sql
  UPDATE auth.users 
  SET raw_user_meta_data = jsonb_set(
    COALESCE(raw_user_meta_data, '{}'::jsonb),
    '{role}',
    '"admin"'
  )
  WHERE email = 'your-email@example.com';
  ```

### Testing Search Functionality

To test if search is working correctly:

1. **Search for an approved park** that you know exists
2. **Check the API directly:**
   ```bash
   curl "http://localhost:3000/api/parks/search?q=Barking%20Hound"
   ```
3. **Check the database directly:**
   ```sql
   SELECT * FROM park_submissions 
   WHERE status = 'approved' 
   AND name ILIKE '%Barking%';
   ```

### Additional Notes

- **State Filtering:** The site may be primarily focused on California parks. Parks in other states (like Georgia) will still appear in search, but may not be featured in location-specific pages.

- **Search Indexing:** Search is performed in real-time from the database, so once a park is approved, it should appear immediately (after cache refresh).

- **Multiple Submissions:** If you submitted the park multiple times, make sure to approve the correct one (usually the most recent).

### Need More Help?

If the park still doesn't appear after approval:
1. Check browser console for JavaScript errors
2. Check server logs for API errors
3. Verify the park data is complete (name, city, state, description)
4. Ensure the search term matches the park's name, city, or description




