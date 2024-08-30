const { MongoClient } = require("mongodb");

const mongoClient = new MongoClient(process.env.MONGODB_URI);
const clientPromise = mongoClient.connect();

const handler = async (event) => {
    try {
        const searchTerm = event.queryStringParameters.search || '';
        const searchField = event.queryStringParameters.field || 'about';
        const page = parseInt(event.queryStringParameters.page) || 1;
        const itemsPerPage = 100;

        const database = (await clientPromise).db("destiny");
        const collection = database.collection("Clans");

        let query = {};

        const isAtlasSearch = process.env.USE_ATLAS_SEARCH === 'true';

        if (searchTerm) {
            if (isAtlasSearch) {
                // Atlas Search query
                query = {
                    $search: {
                        index: "default",
                        text: {
                            query: searchTerm,
                            path: searchField
                        }
                    }
                };
            } else {
                // Text index query
                if (searchField === 'about') {
                    query = { $text: { $search: searchTerm } };
                } else if (searchField === 'name' || searchField === 'motto') {
                    query = { [searchField]: { $regex: searchTerm, $options: 'i' } };
                }
            }
        }

        let totalItems;
        let results;

        if (isAtlasSearch && searchTerm) {
            // For Atlas Search, we need to use aggregate
            const aggregatePipeline = [
                query,
                { $skip: (page - 1) * itemsPerPage },
                { $limit: itemsPerPage },
                { $project: { groupId: 1, name: 1, motto: 1, about: 1 } }
            ];

            results = await collection.aggregate(aggregatePipeline).toArray();
            
            // Count total items
            const countPipeline = [query, { $count: "total" }];
            const countResult = await collection.aggregate(countPipeline).toArray();
            totalItems = countResult.length > 0 ? countResult[0].total : 0;
        } else {
            // For text index or no search term
            totalItems = await collection.countDocuments(query);
            results = await collection.find(
                query,
                { projection: { groupId: 1, name: 1, motto: 1, about: 1 } }
            )
            .skip((page - 1) * itemsPerPage)
            .limit(itemsPerPage)
            .toArray();
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                totalItems,
                totalPages: Math.ceil(totalItems / itemsPerPage),
                currentPage: page,
                results
            }),
        };
    } catch (error) {
        console.error("Error in Netlify function:", error);
        return { statusCode: 500, body: JSON.stringify({ error: error.toString() }) };
    }
};

module.exports = { handler };