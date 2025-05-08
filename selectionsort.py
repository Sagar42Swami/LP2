def greedy_activity_selection(activities):
    """
    Implements a greedy approach to solve the Activity Selection Problem.

    Args:
        activities (list of tuples): A list where each tuple represents an activity
                                     as (start_time, finish_time).

    Returns:
        list of tuples: A list of the selected non-overlapping activities.
    """

    # 1. Sort the activities based on their finish times in non-decreasing order.
    sorted_activities = sorted(activities, key=lambda x: x[1])

    # 2. Select the first activity (it has the earliest finish time).
    selected_activities = [sorted_activities[0]]
    last_finish_time = sorted_activities[0][1]

    # 3. Iterate through the remaining activities and select those that start
    #    after the finish time of the last selected activity.
    for i in range(1, len(sorted_activities)):
        start_time, finish_time = sorted_activities[i]
        if start_time >= last_finish_time:
            selected_activities.append((start_time, finish_time))
            last_finish_time = finish_time

    return selected_activities

# Example Activities (start_time, finish_time)
activities = [(1, 4), (3, 5), (0, 6), (5, 7), (3, 9), (5, 9), (6, 10), (8, 11), (8, 12), (2, 14), (12, 16)]

selected_activities = greedy_activity_selection(activities)

print("Given Activities:", activities)
print("Selected Non-overlapping Activities (Greedy Approach):", selected_activities)