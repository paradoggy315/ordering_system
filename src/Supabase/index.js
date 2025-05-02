import { supabase } from "../supabase.config";
import { toast } from "react-toastify";
import { MdOutlineCloudUpload } from "react-icons/md";
import { shuffleItems } from "../utils/functions";

// Upload image to Supabase Storage
export const supabaseUploadImage = async (
  imageFile,
  promise,
  progressHandler,
  action,
  to
) => {
  promise(true);
  toast.info(`Upload started.....`, {
    icon: <MdOutlineCloudUpload className="text-blue-600" />,
  });
  
  // Create a unique file name
  const fileExt = imageFile.name.split('.').pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `${to}/${fileName}`;
  
  // Upload file to Supabase Storage
  const { data, error } = await supabase.storage
    .from(to === 'profile' ? 'profile_images' : 'food_images')
    .upload(filePath, imageFile, {
      cacheControl: '3600',
      upsert: false
    });
  
  if (error) {
    console.error(error);
    toast.error("Error while uploading, Try again🤗");
    action(null);
    setTimeout(() => {
      promise(false);
    }, 3000);
    return;
  }
  
  // Get the public URL
  const { data: publicURL } = supabase.storage
    .from(to === 'profile' ? 'profile_images' : 'food_images')
    .getPublicUrl(filePath);
  
  action(publicURL.publicUrl);
  promise(false);
  toast.success("Photo Uploaded Successfully😊");
};

// Remove uploaded image
export const supabaseRemoveUploadedImage = async (
  imageUrl,
  imageHandler,
  promise
) => {
  promise(true);
  toast.info(`Removing Image.....`, {
    icon: <MdOutlineCloudUpload className="text-blue-600" />,
    autoClose: 1500,
    toastId: "remove-image",
  });
  
  if (!imageUrl) {
    imageHandler(null);
    promise(false);
    toast.success("Photo removed Successfully😊", { autoClose: 2000, toastId: "remove-image" });
    return;
  }
  
  // Extract path from URL
  const pathMatch = imageUrl.match(/\/storage\/v1\/object\/public\/(food_images|profile_images)\/(.+)/);
  if (!pathMatch) {
    imageHandler(null);
    promise(false);
    toast.success("Photo removed Successfully😊", { autoClose: 2000, toastId: "remove-image" });
    return;
  }
  
  const bucket = pathMatch[1];
  const path = pathMatch[2];
  
  // Delete file from Supabase Storage
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);
  
  if (error) {
    console.error(error);
    toast.error("Error removing image");
  }
  
  imageHandler(null);
  promise(false);
  toast.success("Photo removed Successfully😊", { autoClose: 2000, toastId: "remove-image" });
};

// Silent delete image
export const silentRemoveUploadedImage = async (imageUrl) => {
  if (!imageUrl) return;
  
  // Extract path from URL
  const pathMatch = imageUrl.match(/\/storage\/v1\/object\/public\/(food_images|profile_images)\/(.+)/);
  if (!pathMatch) return;
  
  const bucket = pathMatch[1];
  const path = pathMatch[2];
  
  // Delete file from Supabase Storage
  await supabase.storage
    .from(bucket)
    .remove([path]);
};

// Save food product to database
export const supabaseSaveProduct = async (data) => {
  const { error } = await supabase
    .from('food')
    .insert(data);
  
  if (error) {
    console.error(error);
    toast.error("Error saving food item");
  }
};

// Authentication with email/password sign up
export const EMAILSIGNUP = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  if (error) throw error;
  
  return data;
};

// Sign in with email/password
export const EMAILSIGNIN = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  
  const user = data.user;
  
  // Get or create user profile
  const { data: userData } = await supabase
    .from('users')
    .select('*')
    .eq('uid', user.id)
    .single();
  
  if (!userData) {
    // Create a new user profile
    await supabaseAddUser({
      uid: user.id,
      email: user.email,
      displayName: user.user_metadata?.name || email.split('@')[0],
      providerId: 'password',
    });
    
    return await supabaseGetUser(user.id);
  }
  
  return userData;
};

// Fetch all food items
export const supabaseFetchFoodItems = async () => {
  const { data, error } = await supabase
    .from('food')
    .select('*')
    .order('id', { ascending: false });
  
  if (error) {
    console.error(error);
    return [];
  }
  
  return shuffleItems(data);
};

// Add item to cart
export const supabaseAddToCart = async (data) => {
  const { error } = await supabase
    .from('cart_items')
    .insert(data);
  
  if (error) console.error(error);
};

// Fetch all cart items
export const supabaseFetchAllCartItems = async () => {
  const { data, error } = await supabase
    .from('cart_items')
    .select('*')
    .order('id', { ascending: false });
  
  if (error) {
    console.error(error);
    return [];
  }
  
  return shuffleItems(data);
};

// Update cart item
export const supabaseUpdateCartItem = async (data) => {
  const { error } = await supabase
    .from('cart_items')
    .update(data)
    .eq('id', data.id);
  
  if (error) console.error(error);
};

// Delete cart item
export const supabaseDeleteCartItem = async (item) => {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', item.id);
  
  if (error) console.error(error);
};

// Empty user cart
export const supabaseEmptyUserCart = async (cartItems) => {
  for (const item of cartItems) {
    await supabaseDeleteCartItem(item);
  }
};

// Logout user
export const supabaseLogout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) console.error(error);
};

// Add user to database
export const supabaseAddUser = async (data) => {
  // Check if user already exists
  const user = await supabaseGetUser(data.uid);
  if (user.length === 0) {
    const { error } = await supabase
      .from('users')
      .insert(data);
    
    if (error) console.error(error);
  }
};

// Get user by ID
export const supabaseGetUser = async (uid) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('uid', uid);
  
  if (error) {
    console.error(error);
    return [];
  }
  
  return data;
};

// Update user profile
export const supabaseUpdateUser = async (data) => {
  const { error } = await supabase
    .from('users')
    .update(data)
    .eq('uid', data.uid);
  
  if (error) console.error(error);
};

// Get all users
export const supabaseGetAllUsers = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('*');
  
  if (error) {
    console.error(error);
    return [];
  }
  
  return data;
};

// Delete food item
export const supabaseDeleteFood = async (id) => {
  const { error } = await supabase
    .from('food')
    .delete()
    .eq('id', id);
  
  if (error) console.error(error);
};

// Create order
export const supabaseCreateOrder = async (userId, totalAmount, paymentMethod, cartItems) => {
  // Create order
  const { data: order, error } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      total_amount: totalAmount,
      payment_method: paymentMethod,
      status: 'pending'
    })
    .select();
  
  if (error) {
    console.error(error);
    return null;
  }
  
  // Create order items
  const orderItems = cartItems.map(item => ({
    order_id: order[0].id,
    food_id: item.fid,
    quantity: item.qty,
    price: 0 // This should be populated with the actual price
  }));
  
  const { error: itemError } = await supabase
    .from('order_items')
    .insert(orderItems);
  
  if (itemError) console.error(itemError);
  
  return order[0];
}; 