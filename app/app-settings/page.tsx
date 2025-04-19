import React from 'react';

export default function AppSettings() {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h1 className="text-2xl font-semibold mb-4">Settings</h1>

      <div className="space-y-6">
        {/* Organization Name */}
        <div>
          <label htmlFor="orgName" className="block text-sm font-medium text-gray-700">
            Organization Name
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="orgName"
              id="orgName"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="Catalyst"
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">This will be displayed on your public profile.</p>
        </div>

        {/* Organization Bio */}
        <div>
          <label htmlFor="orgBio" className="block text-sm font-medium text-gray-700">
            Organization Bio
          </label>
          <div className="mt-1">
            <textarea
              id="orgBio"
              name="orgBio"
              rows={3}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="This will be displayed on your public profile. Maximum 240 characters."
            />
          </div>
        </div>

        {/* Organization Email */}
        <div>
          <label htmlFor="orgEmail" className="block text-sm font-medium text-gray-700">
            Organization Email
          </label>
          <div className="mt-1">
            <input
              type="email"
              name="orgEmail"
              id="orgEmail"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="info@example.com"
            />
          </div>
          <div className="mt-2 flex items-center">
            <input
              type="checkbox"
              name="showEmail"
              id="showEmail"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="showEmail" className="ml-2 block text-sm text-gray-900">
              Show email on public profile
            </label>
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <p className="mt-2 text-sm text-gray-500">This is where your organization is registered.</p>
          <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="streetAddress" className="block text-sm font-medium text-gray-700 sr-only">
                Street address
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="streetAddress"
                  id="streetAddress"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="147 Catalyst Ave"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-1/2">
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 sr-only">
                  City
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="city"
                    id="city"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Toronto"
                  />
                </div>
              </div>

              <div className="w-1/2">
                <label htmlFor="region" className="block text-sm font-medium text-gray-700 sr-only">
                  Region
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="region"
                    id="region"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Ontario"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 sr-only">
                Postal code
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="postalCode"
                  id="postalCode"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="A1A 1A1"
                />
              </div>
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 sr-only">
                Country
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="country"
                  id="country"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Canada"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Currency */}
        <div>
          <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
            Currency
          </label>
          <div className="mt-1">
            <select
              id="currency"
              name="currency"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            >
              <option>CAD - Canadian Dollar</option>
              <option>USD - United States Dollar</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-8 border-t border-gray-200 pt-5">
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Reset
          </button>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}