-- Migration: Fix RLS policies for users table
-- This fixes the "Error creating user profile" issue by adding INSERT and UPDATE policies
-- Run this in your Supabase SQL Editor

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can insert own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;

-- Recreate SELECT policy
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Add INSERT policy (allows users to create their profile during signup)
CREATE POLICY "Users can insert own data" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Add UPDATE policy (allows users to update their own profile)
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

